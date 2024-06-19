import oracledb from "oracledb";
import {
  ATMSchema,
  BranchSchema,
  loansSchema,
} from "../models/v1_models.oracle.js";

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
}; //created

// Function to create the loans table
const createLoansTable = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(loansSchema);
    await connection.commit();

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
}; //created

//
const createEmployeesTable = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(loansSchema);
    await connection.commit();

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
}; //

//Function to create the ATM table
const createATMTable = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection();
    for (const query of ATMSchema) {
      await connection.execute(query);
    }
    // console.log('Table "ATM", sequence, and triggers created successfully');
    await connection.commit();
    res.status(201).json({
      success: true,
      msg: "Table Create Successfully",
    });
  } catch (err) {
    console.error("Error creating table, sequence, or triggers:", err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}; //created

export {
  createBranchTable,
  createLoansTable,
  createEmployeesTable,
  createATMTable,
};
