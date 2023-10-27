require("dotenv").config();
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const session = require("express-session");
const bodyParser = require('body-parser')
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);
const errrorMiddleware = require("./middlewares/error-middleware");

const authRouter = require("./router/user-routes");
const transportationRouter = require('./router/transportation-routes')
const externalLardiRouter = require('./external-api/lardi/routes/cargo')
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./middlewares/sessionMiddleware");
const {
  authorizeUser,
  initializeUser,
} = require("./middlewares/socketController");
const pool = require("./db/pool");
const { sendBuhTransport } = require("./nodemailer/nodemailer");


const io = new Server(server, {
  cors: corsConfig,
});
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(express.json());
app.use(cors(corsConfig));
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", transportationRouter);


// EXTERNAL API
app.use('/lardi',externalLardiRouter)
// EXTERNAL API

// Error Має бути в кінці
app.use(errrorMiddleware);
app.use(sessionMiddleware);

app.get('/ok',async(req,res) =>{
  try {
    res.json({
      data:"OK"
    })
  } catch (error) {
    console.log(error);
  }
})
io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
});


// setTimeout(()=>{
//   sendBuhTransport()
// },2000)


server.listen(process.env.PORT || 4400, async () => {
  // await initDb();
  console.log(`Server on PORT : 4400`);
});
