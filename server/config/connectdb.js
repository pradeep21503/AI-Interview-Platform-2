import mongoose  from "mongoose";

const connectdb = async ()=>{
 
    try {
        const res = await mongoose.connect(process.env.DATABASE_URL)
        console.log("DATABASE CONNECTED SUCCESFULLY")
    } catch (error) {
        console.log(error)
        process.exit(-1)
    }
}
export default connectdb