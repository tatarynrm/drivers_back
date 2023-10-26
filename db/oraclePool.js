const ora = require('oracledb')
const {createPool} = require('oracledb')
const poolConfig = {
  user: process.env.DB_LOGIN_NAME,
  password: process.env.DB_LOGIN_PASSWORD,
  connectString: process.env.DB_LOGIN_CONNECT_STRING,
  poolMax: Number(process.env.DB_POOL_MAX|| 20),
  poolMin: Number(process.env.DB_POOL_MIN||10),
  poolIncrement: Number(process.env.DB_POOL_INCREMENT || 1),
  poolTimeOut: Number(process.env.DB_POOL_TIMEOUT||  60)
};

const currSchema = process.env.DB_CURRENT_SCHEMA;

async function initDb() {
  try {
    const pool = await ora.createPool(poolConfig);
    console.log("Запуск бази");
  } catch (err) {
   console.log(err);
  }
}

async function getConn() {
  let conn = await ora.getConnection();
  conn.currentSchema = 'ICTDAT';
  ora.outFormat = ora.OUT_FORMAT_OBJECT;
  return conn;
}

module.exports = {
    getConn,
    initDb
}