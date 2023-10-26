const jwt = require("jsonwebtoken");
const oracledb = require("oracledb");
const pool = require("../db/pool");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "2d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccesToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  async saveToken(userId, refreshToken) {
    const conn = await oracledb.getConnection(pool);
    const result = await conn.execute(
      `BEGIN
            ICTDAT.p_perus.SaveToken(:pKodPerUs,:pToken);
        END;`,
      {
        pKodPerUs: userId,
        pToken: refreshToken,
      }
    );
  }

  async removeToken(refreshToken) {
    const conn = await oracledb.getConnection(pool);
    const sql = `DELETE FROM ictdat.perustoken WHERE token = :valueToDelete`;
    const binds = {
      valueToDelete: refreshToken,
    };
    const options = {
      autoCommit: true,
    };
    const token = await conn.execute(sql, binds, options);

    return token;
  }
  async checkToken(refreshToken) {
    const conn = await oracledb.getConnection(pool);
    const token = await conn.execute(
      `select * from ictdat.perustoken where token = '${refreshToken}'`
    );
    return token.rows[0];
  }
}

module.exports = new TokenService();
