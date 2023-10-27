const RedisStore = require("connect-redis").default;
const redisClient = require("../redis");
const session = require("express-session");

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIROMENT === "production",
    httpOnly: false,
    expires: 1000 * 60 * 60 * 24 * 7,
    sameSite: process.env.ENVIROMENT === "production" ? "none" : "lax",
  },
});

const wrap = (sessionMiddleware) => (socket, next) => {
  sessionMiddleware(socket.request, {}, next);
};

const corsConfig = {
    // origin: "http://localhost:3000",
    origin: "*",
    credentials: true,
  }

module.exports = {
  sessionMiddleware,
  wrap,
  corsConfig
};
