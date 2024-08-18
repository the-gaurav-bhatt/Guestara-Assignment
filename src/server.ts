import http from "http";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();
import mongoose, { MongooseError } from "mongoose";
const server = http.createServer(app);
const URI = process.env.URI;
// use utlencoded while working with forms and not json

console.log(URI);
const PORT = process.env.PORT || 8000;
const startServer = async () => {
  if (URI) {
    mongoose
      .connect(URI)
      .then(() => {
        server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      })
      .catch((err: MongooseError) => {
        console.log(err);
      });
  } else console.log("Missing URI for MongoDB");
};

startServer();
