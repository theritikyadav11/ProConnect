import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ message: "Not authorized, no token provided after Bearer" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming JWT_SECRET is in .env

      // Attach user to the request
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: `Not authorized, token invalid: ${error.message}` });
      }
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res
      .status(401)
      .json({ message: "Not authorized, no token or invalid format" });
  }
};

export { protect };
