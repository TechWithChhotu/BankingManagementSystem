import oracledb from "oracledb";
const poolConfig = {
  user: "system", //Email-chhotustudymail@gmail.com
  password: "123", //password- Chhotu@*#123// MskrckshK@123
  connectString: "localhost/XEPDB1", //localhost/XEPDB1
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
