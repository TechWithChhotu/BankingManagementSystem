import oracledb from "oracledb";

// Pool configuration
const poolConfig = {
  user: "system", // Your username
  password: "123", // Your password
  connectString: "localhost/XEPDB1", // Your connection string
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0,
};

// Function to configure the Oracle DB connection pool
async function oracleDBConfig() {
  try {
    await oracledb.createPool(poolConfig);
    console.log("Oracle, Connection successful");
  } catch (err) {
    console.error("Error starting connection pool:", err);
    throw err;
  }
}

// Function to close the connection pool
async function closePool() {
  try {
    await oracledb.getPool().close(0);
    console.log("Connection pool closed");
  } catch (err) {
    console.error("Error closing connection pool:", err);
  }
}

// Example schema for the branches table
const BranchSchema = `
  CREATE TABLE Branch (
    branch_id VARCHAR2(10) PRIMARY KEY,
    branch_name VARCHAR2(100) NOT NULL,
    address VARCHAR2(200) NOT NULL,
    area_district VARCHAR2(100) NOT NULL,
    area_pin_code VARCHAR2(10) NOT NULL,
    manager_name VARCHAR2(100) NOT NULL,
    contact_number VARCHAR2(15) NOT NULL,
    email VARCHAR2(100),
    ifsc_code VARCHAR2(15) NOT NULL,
    timeStamp VARCHAR2(50),
    services_offered CLOB
  )
`;

// Function to create the branches table
const createBranchTable = async (req, res) => {
  let connection;

  try {
    // Get a connection from the connection pool
    connection = await oracledb.getConnection();

    // Execute the SQL query to create the table
    await connection.execute(BranchSchema);
    // Commit the transaction
    await connection.commit();

    // await connection.execute(BranchSchema,autoCommit);

    // Send success response
    res.status(201).json({
      success: true,
      msg: "Table created successfully",
    });
  } catch (err) {
    console.error("Error creating table:", err);
    res.status(500).json({
      success: false,
      msg: "Error creating table",
      error: err.message,
    });
  } finally {
    // Release the connection
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

export { oracleDBConfig, closePool, createBranchTable };

// https://chatgpt.com/share/1fc43e2e-99fd-495d-aadc-6059101f7d0a  <<<-- to see in this oracle data in terminal
