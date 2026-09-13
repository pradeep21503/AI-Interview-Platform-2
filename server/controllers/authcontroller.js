import createtoken from "../config/createtoken.js";
import user from "../models/usermodel.js";
import bcrypt from "bcryptjs"
const register = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            res.json({"sucess":false,"message":"All Fields Required"})
        }
        const existuser = await user.findOne({email});
        if(existuser){
            return res.json({"sucess":false,"message":"User Already Registered"})
        }
        const hashpassword = await bcrypt.hash(password,10)
        const newuser = await user.create({name,email,password:hashpassword})
        const token  =  await createtoken(newuser._id)
         res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7*24 * 60 * 60 * 1000
         });
        res.json({"sucess":true,"message":"Succesfully Registered",user:newuser})
    } catch (error) {
        res.json({"sucess":false,"message":error.message})
    }
   
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                sucess: false,
                message: "All Fields Required"
            });
        }

        const existuser = await user.findOne({ email });

        if (!existuser) {
            return res.json({
                sucess: false,
                message: "User Not Found"
            });
        }

        const isMatch = await bcrypt.compare(password, existuser.password);

        if (!isMatch) {
            return res.json({
                sucess: false,
                message: "Invalid Password"
            });
        }

        const token = await createtoken(existuser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            sucess: true,
            message: "Login Successful",
            user: existuser
        });

    } catch (error) {
        res.json({
            sucess: false,
            message: error.message
        });
    }
};
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({
            sucess: true,
            message: "Logged Out Sucesfully"
        });

    } catch (error) {
        res.json({
            sucess: false,
            message: error.message
        });
    }
};


const getcurrentuser = async (req, res) => {
  const currentuser = await user.findById(req.userid).select("-password");

  res.json({
    success: true,
    user: currentuser,
  });
};

export  {  getcurrentuser,register, login, logout };