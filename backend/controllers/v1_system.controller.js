import { Employee } from "../models/v1_models.mongoDB.js";
import oracledb from "oracledb";
import { Customer } from "../models/v1_models.mongoDB.js";

const addBranch = async (req, res) => {
  let connection;

  try {
    const {
      branch_id,
      branchName,
      address,
      areaDistrict,
      areaPinCode,
      managerName,
      contactNumber,
      email,
      ifscCode,
      servicesOffered,
    } = req.body;

    connection = await oracledb.getConnection();
    const time_stamp = new Date().toISOString();
    const result = await connection.execute(
      `INSERT INTO Branch (
        branch_id,
        branch_name,
        address,
        area_district,
        area_pin_code,
        manager_name,
        contact_number,
        email,
        ifsc_code,
        timeStamp,
        services_offered
      ) VALUES (
        :branch_id,
        :branchName,
        :address,
        :areaDistrict,
        :areaPinCode,
        :managerName,
        :contactNumber,
        :email,
        :ifscCode,
        :timeStamp,
        :servicesOffered
      )`,
      {
        branch_id,
        branchName,
        address,
        areaDistrict,
        areaPinCode,
        managerName,
        contactNumber,
        email,
        ifscCode,
        timeStamp: time_stamp,
        servicesOffered: {
          val: servicesOffered,
          dir: oracledb.BIND_IN,
          type: oracledb.STRING,
        },
      },
      { autoCommit: true }
    );

    console.log('Data inserted into "Branches" successfully');
    res.status(200).json({
      success: true,
      msg: 'Data inserted into "Branches" successfully',
      data: result,
    });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({
      success: false,
      msg: "Error inserting data",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

// Function to retrieve inserted data from the branches table
const getAllBranches = async (req, res) => {
  let connection;

  try {
    // Get a connection from the connection pool
    connection = await oracledb.getConnection();

    // SQL query to select all data from the branches table
    const sql = `SELECT * FROM Branch`;

    // Execute the query
    const result = await connection.execute(sql);

    // Log the fetched rows
    // console.log("Fetched rows:", result);

    // to convert in json formate
    const josnData = result.rows.map((e) => ({
      branch_id: `${e[0]}`,
      branch_name: `${e[1]}`,
      address: `${e[2]}`,
      area_district: `${e[3]}`,
      area_pin_code: `${e[4]}`,
      manager_name: `${e[5]}`,
      contact_number: `${e[6]}`,
      email: `${e[7]}`,
      ifsc_code: `${e[8]}`,
      operating_hours: `${e[9]}`,
      services_offered: `${e[10]}`,
    }));

    res.status(200).json({
      success: true,
      msg: "Fetched Successfully",
      data: josnData,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
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

const addEmp = async (req, res) => {
  try {
    const { name, phone, email, password, position, adharNumber, PANNumber } =
      req.body;

    const newEmp = new Employee({
      name,
      phone,
      email,
      password,
      position,
      adharNumber,
      PANNumber,
      branch_id: "BRSHK01",
    });

    await newEmp.save();

    res.status(201).json({
      success: true,
      msg: "Employee added successfully",
      data: newEmp,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "failed to add employee",
      Error: err.message,
    });
  }
};

/*======================Sign-In======================*/
const login = async (req, res, next) => {
  try {
    const { phone, password, lp, branchId } = req.body; // lp--> login pin, later i`ve integrate it ||| branchId, if loger is employee

    if (branchId) {
      const emp = await Employee.findOne({ phone });
      if (emp) {
        const token = emp.generateToken();
        res.cookie("BankOfBihar", token, { expiresIn: "1d" });
        res.status(200).json({
          success: true,
          message: "Login successfully",
          data: emp,
        });
      } else {
        res.status(404).json({
          success: false,
          msg: "Login failed, Data not found!",
        });
      }
    } else {
      const customer = await Customer.findOne({ phone, password });
      if (customer) {
        const token = customer.generateToken();
        res.cookie("BankOfBihar", token, { expiresIn: "1d" });
        res.status(200).json({
          success: true,
          message: "Login successfully",
          data: customer,
        });
      } else {
        res.status(404).json({
          success: false,
          msg: "Login failed, Data not found!",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { addBranch, getAllBranches, addEmp, login };
