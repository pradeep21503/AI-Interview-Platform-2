import jwt from "jsonwebtoken"
const createtoken  = (id)=>{
    const token  =  jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token
}
export default createtoken