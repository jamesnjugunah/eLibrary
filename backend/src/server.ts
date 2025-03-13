import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/usersRoutes";
import bookRoutes from "./routes/booksRoutes"; 
import authRoutes from "./routes/authroutes";
import borrowRoutes from "./routes/borrowRoutes";

dotenv.config();
const app = express();

const Port = process.env.PORT;
console.log(Port);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/borrow', borrowRoutes);


app.listen(Port, () => {
  console.log(`Server running on http://localhost:${Port}`);
});
