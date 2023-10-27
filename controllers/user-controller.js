const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-errors");
const oracledb = require("oracledb");
const pool = require("../db/pool");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Помилка валідації даних", errors.array())
        );
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const connection = await oracledb.getConnection(pool);
      const { email, password } = req.body;
      const userData = await userService.login(email, password);


      const result = await connection.execute(
        `
      BEGIN
          ICTDAT.P_PERUS.LOG(:pKodPerUs,:pOper);
      END;
      `,
        {
          pKodPerUs: userData?.user.KOD,
          pOper: "LOGIN",
        }
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = userService.logout(refreshToken);

      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }
  async getInfo(req, res, next) {
    const { KOD_UR } = req.body;
    try {
      const users = await userService.getInfo(KOD_UR);

      res.json(users);
    } catch (e) {
      next(e);
    }
  }
  async getTwoYearInfo(req, res, next) {
    const { KOD_UR } = req.body;
    try {
      const users = await userService.getTwoYearsData(KOD_UR);
      res.json({
        lastYear:users.resultPrev.rows,
        thisYear:users.resultThis.rows
      });
    } catch (e) {
      next(e);
     
    }
  }
}

module.exports = new UserController();
