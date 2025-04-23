import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

const PORT = process.env.PORT || 3000;


dotenv.config();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node.js and Express.js with TypeScript");
});


const createJWT = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: "1h" });
};


app.post("/sign-up", async (req, res) => {

  const { email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });
  res.json(user);
});

app.post("/sign-in", async (req, res) => {

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {  
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = createJWT(user);
  console.log(token);

  //Set the token as a cookie


  res.json({ message: "Logged in successfully" });

});

app.post("/logout", (req, res) => {

  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });

});

//Type for request object with user property
//type ProtectedRequest = Request & { user?: JwtPayload };
interface ProtectedRequest extends Request {
  user?: JwtPayload;
}

//Middleware to check if user is logged in
const authMiddleware = (req: ProtectedRequest, res: Response, next: NextFunction) => {

  // The token is sent from frontend as a http-only cookie


// The cookie is sent with the request as a header
 const bearerToken = req.headers.authorization?.split(" ")[1];

//Bearer 342rmdflskfjsldkfk

  if (!bearerToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if(!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT_SECRET is not defined" });
    return;
  }

  //Verify token
  try {

    const JwtPayload = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = JwtPayload; //Add user to request object
    next();
 
  } catch (error) {

    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
    return;

  }

}

app.get("/dashboard", authMiddleware, (req: ProtectedRequest, res: Response) => {
  res.json({ message: "Protected route with authmiddleware. Token is valid Logged in user is: " + req.user?.email });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



