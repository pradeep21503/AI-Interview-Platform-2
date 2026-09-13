import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/connectdb.js";
import cookieParser from "cookie-parser";
import authrouter from "./routes/authrouter.js";
import hrrouter from "./routes/hrrouter.js"
import dsarouter from "./routes/Dsarouter.js";
import cors from "cors"
import interviewrouter from "./routes/interviewrouter.js";
import { getInternalQuestion } from "./controllers/DsaController.js";

dotenv.config()
connectdb()
const app = express();
const PORT = process.env.PORT || 6000
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authrouter)
app.use("/api/interview",interviewrouter)
app.use("/api/hr",hrrouter)
app.use("/api/dsa",dsarouter )
app.get("/api/internal/question", getInternalQuestion);
app.get("/",(req,res)=>{
    return res.json({"message":"Welcome"});
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Started on Port ${PORT}`);
});