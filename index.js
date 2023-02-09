import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongoDB/connect.js";
import postRoutes from './routes/postRoutes.js';
import wallRoutes from './routes/wallRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import path from "path";
import fs from "fs"


dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({extended : true}))

app.use('/api/post', postRoutes);
app.use('/api/wall', wallRoutes);
app.use('/api/comment', commentRoutes)
app.use('/auth', authRoutes)
app.use('/api', userRoutes)

app.use('/images', express.static('public/images'));


app.get('/public/images/:filename', (req, res) => {
    const file = `public/images/${req.params.filename}`;
    res.sendFile(path.resolve(file));
  });

  app.get('/images', (req, res) => {
    fs.readdir('public/images', (err, files) => {
      if (err) {
        return res.status(500).send({ error: err });
      }
      res.send({ images: files });
    });
  });

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to WALL AI"
    });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => {
      console.log(`Server is running on port : 8080`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
