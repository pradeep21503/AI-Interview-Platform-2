import jwt from "jsonwebtoken";

const isauth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userid = decoded.id;

    next();
  } catch (error) {
   
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isauth;