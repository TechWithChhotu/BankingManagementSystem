import mongoose from "mongoose";
import { LastAllocatedAccountNumber } from "../models/v1_models.mongoDB.js";

const getLastAccountNumber = async () => {
  try {
    // const accountN = new LastAllocatedAccountNumber({
    //   lastAccountNumber: "16760000",
    // });
    // await accountN.save();

    const lastAccountNumber = await LastAllocatedAccountNumber.findOne();
    const accountNumber = lastAccountNumber.lastAccountNumber;
    return accountNumber;
  } catch (err) {
    return null;
  }
};

async function updateLastAccountNumber(newNumber) {
  const updatedRecord = await LastAllocatedAccountNumber.findOneAndUpdate(
    {}, // Find the first document
    { lastAccountNumber: newNumber }, // Update the lastAccountNumber field
    { new: true, upsert: true } // Return the updated document, create if not exists
  );
  return updatedRecord.lastAccountNumber;
}

async function getNewAccountNumber() {
  const currentNumber = await getLastAccountNumber();
  if (currentNumber) {
    const newNumber = (parseInt(currentNumber, 10) + 1).toString(); // Increment the number
    const updatedNumber = await updateLastAccountNumber(newNumber);
    return updatedNumber;
  } else {
    console.error("Error generating new account number:");
    return null;
  }
}

export default getNewAccountNumber;
