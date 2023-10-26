const redisClient = require("../redis");

module.exports.rateLimiter =
  (secondsLimit, limitAmount) => async (req, res, next) => {
    const ip = req.connection.remoteAddress.slice(0, 2);
    const [response] = await redisClient.multi().incr(ip).expire(ip, 60).exec();
    console.log(response);
    if (response[1] > 10) {
      res.json({
        loggedIn: false,
        status: "Slow down... !!! Try again in a few seconds...",
      });
    } else next();
  };
