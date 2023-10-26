const redisClient = require("../redis");
module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request");
    next(new Error("Not auth..."));
  } else {
    next();
  }
};
module.exports.initializeUser = (socket, next) => {
    socket.user = {...socket.request.session.user}
    redisClient.hset(`uerid:${socket.user.id}`,"userid",socket.user.id)
    console.log(socket.user);
};
