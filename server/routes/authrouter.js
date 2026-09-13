import express from "express"
import  {register, login, logout, getcurrentuser } from "../controllers/authcontroller.js";
import isauth from "../middlewares/isauth.js";
const authrouter = express.Router();
authrouter.post("/register",register)
authrouter.post("/login",login)
authrouter.post("/logout",logout)
authrouter.get("/me",isauth,getcurrentuser)
export default authrouter