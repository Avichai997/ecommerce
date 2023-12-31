import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

export const generateToken = (user) =>
  jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET
  );

export const isAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization || req.headers.Authorization;
  if (!bearerToken) {
    res.status(401).send({ message: 'Token is not supplied' });
  } else {
    const token = bearerToken.slice(7, bearerToken.length);
    jwt.verify(token, JWT_SECRET, (err, data) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = data;
        next();
      }
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Token is not valid for admin user' });
  }
};

export const expressAsyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
export const nameRegex = /^[A-Za-z\s]+$/;
