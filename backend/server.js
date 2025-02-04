import express from "express";
import dotenv from "dotenv";
import wetherRoute from "./routers/wether.route.js";
import cors from "cors";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const allowedOrigins = [
  "https://weather-check-pearl-xi.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use("/api/weather", wetherRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
