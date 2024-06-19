import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

/*======================>>customerSchema<<======================*/
const customerSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    phone: String,
    email: String,
    adharNumber: String,
    panNumber: String,
    avatar: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.obV5KTWZPdbxODJekwix4gHaHa?w=166&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    signature: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.obV5KTWZPdbxODJekwix4gHaHa?w=166&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
  },
  { timestamps: true }
);

/*======================>>employeesSchema<<======================*/
const employeesSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    phone: String,
    email: String,
    adharNumber: String,
    panNumber: String,
    position: {
      type: String,
      enum: [
        "Manager",
        "Teller",
        "Customer Service Representative",
        "Admin",
        "Loan Officer",
        "Clerk",
        "Peon",
      ],
    },
    branch_id: String,
    avatar: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.obV5KTWZPdbxODJekwix4gHaHa?w=166&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
  },
  { timestamps: true }
);

/*======================>>transactionSchema<<======================*/
const transactionSchema = new mongoose.Schema(
  {
    amount: Number,
    // accountType: String,
    transactionType: {
      type: String,
      enum: ["Credit", "Debit"],
    },
    creditedAccountNumber: String,
    locatoin: String,
    locatoinPinCode: Number,
    modeOfTransaction: {
      type: String,
      enum: ["Online", "Branch"], //agr online hua h to exact location v store karna h,,, taki frod transaction ka pta lagaya ja sake | or unspected time period  me hota h to account ko turant de-active kardenge and transaction ko frig(rad) kar denge.... for eg:  do transaction ek bihar or ek delhi me hota h to  within 5minutes jo ki sambhab nhi h to hm es account ka dono transaction frig(rad) kar denge in the case of credit.... only
    },

    debitedAccountNumber: {
      type: String,
      default: "",
    },
    creditedAccountNumber: String,
    Deposit_branch_id: String,
    teller_emp_id: mongoose.Schema.Types.ObjectId,
    creditOrDebitAccount: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

/*======================>>failedTransactionLogSchema<<======================*/
const failedTransactionLogSchema = new mongoose.Schema(
  {
    transaction_id: mongoose.Schema.Types.ObjectId,
    errorType: String,
    timeStamp: Date,
  },
  { timestamps: true }
);

/*======================>>atmCardSchema<<======================*/
const atmCardSchema = new mongoose.Schema(
  {
    card_number: {
      type: String,
      required: true,
      unique: true,
      minlength: 16,
      maxlength: 16,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    pin: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 4,
    },
    issued_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware to update the updated_at field on every save
// atmCardSchema.pre("save", function (next) {
//   this.updated_at = Date.now();
//   next();
// });

/*======================>>accountSchema<<======================*/
const accountSchema = new mongoose.Schema(
  {
    customer_id: mongoose.Schema.Types.ObjectId,
    accountNumber: {
      type: String,
    },
    branch_id: {
      type: String,
      required: [true, "branch id is required"],
    },
    transactionLimit: {
      type: Number,
      default: 49999,
    },
    accountType: {
      type: String,
      enum: [
        "Saving Account",
        "Current Account",
        "Recurring Deposit Account",
        "Zero Balance Saving Account",
      ], //read about account types --> [https://byjus.com/govt-exams/types-of-bank-accounts/]
      default: "Saving Account",
    },
    balance: Number,
    runningStatus: {
      type: Boolean,
      enum: [true, false], //true --> Active | false --> Block
      default: true,
    },
    atmCard: {
      isAtmCard: {
        type: Boolean,
        default: false,
      },
      atmCardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ATMCards", // This assumes you have an 'ATMCards' model defined
        required: function () {
          return this.atmCard.isAtmCard;
        }, // Makes atmCardId required if isAtmCard is true
      },
    },
  },
  { timestamps: true }
);
/*======================>>Pre-save middleware to set the transactionLimit<<======================*/
accountSchema.pre("save", async function (next) {
  try {
    const customer = await Customer.findById(this.customer_id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (this.accountType === "Current Account") {
      // No limit for current account if PAN is available
      if (customer.panNumber) {
        this.transactionLimit = Number.MAX_SAFE_INTEGER; // practically unlimited
      } else {
        this.transactionLimit = 49999;
      }
    } else {
      // For other account types
      if (customer.panNumber) {
        this.transactionLimit = 100000;
      } else {
        this.transactionLimit = 49999;
      }
    }
    if (this.accountType != "Zero Balance Saving Account") {
    }
    next();
  } catch (error) {
    next(error);
  }
});

//** Pre-save middleware to set debitedAccountNumber based on modeOfTransaction
transactionSchema.pre("save", function (next) {
  if (this.modeOfTransaction === "Online") {
    this.locatoin = "Jaimangla";
    this.locatoinPinCode = "811107"; //later i`ve implement, exact piccode gated form frontend and similarlly frontend
  } else if (this.modeOfTransaction === "Branch") {
    this.debitedAccountNumber = "RBI(OwnerAccount)";
  }
  next();
});

employeesSchema.methods = {
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  },

  generateToken: function () {
    return JWT.sign(
      {
        id: this._id,
        name: this.name,
        email: this.email,
        position: this.position,
        branch_id: this.branch_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: 604800 }
    );
  },
};

customerSchema.methods = {
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  },

  generateToken: function () {
    return JWT.sign(
      {
        id: this._id,
        name: this.name,
        email: this.email,
        branch_id: this.branch_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: 604800 }
    );
  },
};

const lastAllocatedNumberSchema = new mongoose.Schema({
  lastAccountNumber: {
    type: String,
    default: "16760001",
  },
});

export const LastAllocatedAccountNumber = mongoose.model(
  "LastAllocatedAccountNumber",
  lastAllocatedNumberSchema
);

export const ATMCards = mongoose.model("ATMCards", atmCardSchema);
export const FailedTransactionLog = mongoose.model(
  "FailedTransactionLog",
  failedTransactionLogSchema
);

export const Employee = mongoose.model("Employee", employeesSchema);
export const Transaction = mongoose.model("Transaction", transactionSchema);
export const Account = mongoose.model("Account", accountSchema);
export const Customer = mongoose.model("Customer", customerSchema);
