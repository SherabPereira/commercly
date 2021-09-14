const { Schema, model } = require("mongoose");

module.exports = model(
  "User",
  new Schema(
    {
      username: {
        type: String,
        unique: [true, "Username already exists"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);
