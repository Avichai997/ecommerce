/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import User from '../../models/userModel';
import Product from '../../models/productModel';
// import Order from "../../models/orderModel";

// 1) Connect to DB:
dotenv.config('../../../.env');

mongoose.set('strictQuery', true).connect(process.env.MONGODB_URL);
mongoose.connection.on('connected', () => {
  console.log('DB connection successful!', '\x1b[0m');
});
mongoose.connection.once('open', () => seedData());

// 2) Read Json files:
// const orders = JSON.parse(readFileSync(`${__dirname}/orders.json`, "utf-8"));
const users = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf-8'));
const products = JSON.parse(readFileSync(`${__dirname}/products.json`, 'utf-8'));

const importAllData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Product.create(products, { validateBeforeSave: false });
    // await Order.create(orders, { validateBeforeSave: false });
    console.log('Data seeded in DB!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteAllData = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('DB dropped!');
  } catch (err) {
    console.log(err);
  }
};

async function seedData() {
  if (process.argv[2] === '--import') {
    importAllData();
  } else if (process.argv[2] === '--delete') {
    deleteAllData();
  } else if (!process.argv[2]) {
    await deleteAllData();
    await importAllData();
  }

  process.exit();
}
