const pool = require("../db/pool");
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-errors");
class UserService {
  async registration(email, password) {
    const connection = await oracledb.getConnection(pool);
    const candidate = await connection.execute(
      `select * from ictdat.perus where email = '${email}' `
    );
    if (candidate.rows > 0) {
      return ApiError.BadRequest(`Користувач з таким емейлом вже існує.`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO ictdat.perus (email,pwdhash,kod_ur,datreestr) VALUES (:val1, :val2,:val3,:val4) returning kod into :outbind`;
    const binds = {
      val1: email,
      val2: hashPassword,
      val3: 323191,
      val4: new Date(),
      outbind: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    };
    const options = {
      autoCommit: true,
    };
    const result = await connection.execute(sql, binds, options);
    const thisUser = await connection.execute(
      `select * from ictdat.perus where email = '${email}'`
    );
    const userData = thisUser.rows[0];
    const userDto = new UserDto(userData);

    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.KOD, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  async login(email, password) {
    const conn = await oracledb.getConnection(pool);
    const candidate = await conn.execute(
      `select * from ictdat.perus where email = '${email}' `
    );

    if (candidate.rows <= 0) {
      throw ApiError.BadRequest(`Такого користувача не знайдено`);
    }
    const isEqualPassword = await bcrypt.compare(
      password,
      candidate.rows[0].PWDHASH
    );

    if (!isEqualPassword) {
      throw ApiError.BadRequest("Некоректний пароль");
    }
    const userDto = new UserDto(candidate.rows[0]);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.KOD, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.checkToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const conn = await oracledb.getConnection(pool);
    const user = await conn.execute(
      `select * from ictdat.perus where kod = ${userData.KOD}`
    );
// console.log(user.rows[0].KOD_UR);
const urName = await conn.execute(`select * from ictdat.ur where kod = ${user.rows[0].KOD_UR}`)
console.log(urName.rows[0].NUR);
// const urInfo = urName
    const userDto = new UserDto({...user.rows[0]});
    const tokens = tokenService.generateTokens({ ...userDto});
    await tokenService.saveToken(userDto.KOD, tokens.refreshToken);
    return {
      ...tokens,
      user: {...userDto,NUR:urName.rows[0].NUR},
      
    };
  }

  async getInfo(KOD_UR) {
    const conn = await oracledb.getConnection(pool);
    const users = await conn.execute(`
    select count(*) as kp_all,
       sum(case when trunc(a.perevdat, 'YYYY') = add_months(trunc(sysdate, 'YYYY'), -12) then 1 else 0 end) as kp_year_prev,
       sum(case when trunc(a.perevdat, 'YYYY') = trunc(sysdate, 'YYYY') then 1 else 0 end) as kp_year_curr,
       sum(case when trunc(a.perevdat, 'MM') = add_months(trunc(sysdate, 'MM'), -1) then 1 else 0 end) as kp_month_prev,
       sum(case when trunc(a.perevdat, 'MM') = trunc(sysdate, 'MM') then 1 else 0 end) as kp_month_curr,
       min(a.datzav) as datzav_first,
       max(a.datzav) as datzav_last
from ictdat.zaylst a
where a.kod_per = ${KOD_UR} and
      a.appdat is not null
    `);
    return users.rows;
  }

  async getTwoYearsData(KOD_UR) {
  
    const conn = await oracledb.getConnection(pool);
    const resultPrev = await conn.execute(`
    select to_char(a.dat, 'YYYY.MM') as mis,
       count(*) as kil
from ictdat.zay a
where a.kod_per = ${KOD_UR} and
      trunc(a.dat, 'YYYY') = trunc(add_months(trunc(sysdate, 'MM'), -12), 'YYYY')
group by to_char(a.dat, 'YYYY.MM')
order by mis
    `)
    const resultThis = await conn.execute(`
    select to_char(a.dat, 'YYYY.MM') as mis,
       count(*) as kil
from ictdat.zay a
where a.kod_per = ${KOD_UR} and
      trunc(a.dat, 'YYYY') = trunc(sysdate, 'YYYY')
group by to_char(a.dat, 'YYYY.MM')
order by mis
    `);

    return {
      resultPrev,
      resultThis
    }
  }

}

module.exports = new UserService();
