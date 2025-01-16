import express from 'express';
import {createAdmin} from '../Controllers/admin.controller.js'
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/createAdmin", createAdmin);

export default Router;
