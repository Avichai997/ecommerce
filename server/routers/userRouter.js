import express from 'express';
import { isAuth } from '../utils';
import { createAdmin, register, signIn, updateUser } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/createadmin', createAdmin);
userRouter.post('/signin', signIn);
userRouter.post('/register', register);
userRouter.patch('/:id', isAuth, updateUser);
export default userRouter;
