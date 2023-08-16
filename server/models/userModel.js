import mongoose from 'mongoose';
import { passwordRegex } from '../utils';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (password) => passwordRegex.test(password),
        message: () => `
Please enter a password that includes at least one number, one lowercase letter, one uppercase letter, one special character (!@#$%^&*), and is at least 8 characters long.`,
      },
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model('User', userSchema);
export default User;
