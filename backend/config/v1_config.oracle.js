import oracledb from "oracledb";
const poolConfig = {
  user: process.env.ORACLE_USERNAME, //Email-chhotustudymail@gmail.com
  password: process.env.ORACLE_PASSWORD, //password- Chhotu@*#123// MskrckshK@123
  connectString: process.env.ORACLE_CONNECTION_STRING, //localhost/XEPDB1
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0,
};

async function oracleDBConfig() {
  try {
    await oracledb.createPool(poolConfig);
    console.log("Oracle, Connection successful");
  } catch (err) {
    console.error("Error starting connection pool:", err);
    throw err;
  }
}

async function closePool() {
  try {
    await oracledb.getPool().close(0);
    console.log("Connection pool closed");
  } catch (err) {
    console.error("Error closing connection pool:", err);
  }
}
export { oracleDBConfig, closePool };
