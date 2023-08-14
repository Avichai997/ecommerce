import User from '../models/userModel';
import { expressAsyncHandler, generateToken } from '../utils';

export const createAdmin = expressAsyncHandler(async (req, res) => {
  const createdUser = await User.create({
    name: 'admin',
    email: 'avichai997@gmail.com',
    password: 'Motorola1!',
    isAdmin: true,
  });

  res.status(201).json(createdUser);
});

function sendUserResponse(res, user) {
  const { _id, name, email, isAdmin } = user;
  const token = generateToken(user);

  res.status(200).json({
    _id,
    name,
    email,
    isAdmin,
    token,
  });
}
export const signIn = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    res.status(401).json({
      message: 'Invalid Email or Password',
    });
  }

  sendUserResponse(res, user);
});

export const register = expressAsyncHandler(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  if (!newUser)
    res.status(401).json({
      message: 'Invalid User Data',
    });

  sendUserResponse(res, newUser);
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    res.status(404).send({
      message: 'User Not Found',
    });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.password = req.body.password || user.password;

  const updatedUser = await user.save();

  sendUserResponse(res, updatedUser);
});
