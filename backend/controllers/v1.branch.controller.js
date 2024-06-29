import { v2 } from "cloudinary";
import { Transaction, Account, Customer } from "../models/v1_models.mongoDB.js";
import fs from "fs";
import getNewAccountNumber from "./generateNewAccountNumber.js";

const openAccount = async (req, res) => {
  try {
    const { name, password, phone, email, adharNumber, panNumber } = req.body; //for customber
    const { balance, accountType, isATMCard } = req.body;

    // create a new customer
    const newCustomer = new Customer({
      name,
      password,
      phone,
      email,
      adharNumber,
      panNumber,
    });
    /*---------------------->>Image Handling<<----------------------*/
    if (req.file) {
      try {
        const result = await v2.uploader.upload(req.file.path, {
          folder: "BankOfBihar", // Save files in a folder named lms
          width: 250,
          height: 250,
          gravity: "faces", // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
          crop: "fill",
        });

        if (result) {
          newCustomer.avatar = result.secure_url;
          // Delete the file from the local uploads folder
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error(
                `Failed to delete local file: ${req.file.path}`,
                err
              );
            }
          });
        }
      } catch (err) {
        res.status(500).json({
          success: false,
          msg: "failed to open account",
        });
      }
    }
    await newCustomer.save();
    const newAccountNumber = await getNewAccountNumber();

    if (newCustomer) {
      // Create a new account

      console.log();
      const newAccount = new Account({
        customer_id: newCustomer._id,
        branch_id: "BRSHK01",
        balance: balance || 0,
        accountNumber: newAccountNumber,
        accountType,
        atmCard: {
          //   isAtmCard: isATMCard || false,
          isAtmCard: false,
        },
      });
      await newAccount.save();
      res.status(201).json({
        success: true,
        msg: "Account created successfully",
        data: newAccount,
      });
    } else {
      await Customer.deleteOne({ _id: newCustomer._id });
      res.status(500).json({
        message: "Failed to open account",
        error: "Something went wrong",
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to open account", error: err.message });
  }
};

const deposite = async (req, res) => {
  try {
    const { accountNumber, money } = req.body;
    const newTransaction = new Transaction({
      amount: money,
      transactionType: "Credit",
      creditedAccountNumber: accountNumber,
      teller_emp_id: req.user.id,
      Deposit_branch_id: req.user.branch_id,
      modeOfTransaction: "Branch",
    });

    // deposite amount in provided a/c number
    const account = await Account.findOneAndUpdate(
      { accountNumber }, // Find the document where the accountNumber matches
      { $inc: { balance: money } }, // Increment the balance field by the amount of money
      { new: true, upsert: true } // Return the updated document, create if not exists
    );

    await account.save();
    if (account) {
      await newTransaction.save();
    } else {
      res.status(500).json({
        success: false,
        msg: "deposit fail, plz try again",
      });
    }
    res.status(200).json({
      success: true,
      msg: "deposit successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }

  // kis branch se hua h
  /*
  const transactionSchema = new mongoose.Schema(
  {
    amount: Number,
    transactionType: {
      type: String,
      enum: ["Credit", "Debit"],
    },
    modeOfTransaction: {
      type: String,
      enum: ["Online", "Branch"], //agr online hua h to exact location v store karna h,,, taki frod transaction ka pta lagaya ja sake | or unspected time period  me hota h to account ko turant de-active kardenge and transaction ko frig(rad) kar denge.... for eg:  do transaction ek bihar or ek delhi me hota h to  within 5minutes jo ki sambhab nhi h to hm es account ka dono transaction frig(rad) kar denge in the case of credit.... only
    },
    Deposit_branch_id: String,
    teller_emp_id: mongoose.Schema.Types.ObjectId,
    creditOrDebitAccount: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);
 */
};

const withdraw = async (req, res) => {
  try {
    const { accountNumber, money, verify } = req.body;

    const accountInfo = await Account.findOne({ accountNumber });

    const customerInfo = await Customer.findOne({
      _id: accountInfo.customer_id,
    });

    if (!verify) {
      return res.status(200).json({
        success: true,
        msg: "Plz verify signature & Person",
        data: { signature: accountInfo.signature, avatar: customerInfo.avatar },
      });
    }

    accountInfo.balance -= money;
    await accountInfo.save();
    //later, add deducted money in owner account

    return res.status(200).json({
      success: true,
      msg: "Withdraw successful",
      data: accountInfo,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

export { openAccount, deposite, withdraw };
