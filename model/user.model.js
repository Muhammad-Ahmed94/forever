import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
    },
    email: {
      type: String,
      require: [true, "email required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      require: [true, "password require to proceed"],
      minLength: [7, "Password must be atleast 7 characters"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["Customer", "Admin"],
      default: "Customer",
    },
  },
  {
    timestamps: true, // Adds create at, update at...
  }
);

// Hash password before saving to db (Pre-save)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// check pwd before logging in
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("User", userSchema);
export default userModel;