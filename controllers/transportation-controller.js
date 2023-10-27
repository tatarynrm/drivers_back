const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-errors");
const transportationService = require("../service/transportation-service");
class TransportationController {
  async transportation(req, res, next) {
    const { KOD } = req.body;

    try {
      const userData = await transportationService.transportations(KOD);
      res.json(userData.result.rows);
    } catch (e) {
      next(e);
    }
  }
  async allZap(req, res, next) {
    try {
      const userData = await transportationService.getAllZap();
      // const zap = userData.filter(item => !item.ZAM)
      const items = userData.result.rows;
      // const zap = items.splice(1,1)
      const updatedArray = items.map((item) => {
        // Modify properties of the objects
        return { ...item, ZAPTEXT: "" };
      });
      res.json(updatedArray);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = new TransportationController();
