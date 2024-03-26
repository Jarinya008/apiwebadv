import express from "express";
import { router as user } from "./api/user";
import { router as upload } from "./api/upload";
import { router as vote } from "./api/vote";
import { router as admin } from "./api/admin";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyDKHFHiBhRag4Ll8Uv5F9P5zPwJSld6iBI",
  authDomain: "projectwebadv.firebaseapp.com",
  projectId: "projectwebadv",
  storageBucket: "projectwebadv.appspot.com",
  messagingSenderId: "436147540585",
  appId: "1:436147540585:web:276b98b409232f187388f8",
  measurementId: "G-TJCMRLGZ91"
};
app.use(
    cors({
      origin: "*", //everyone can calling (mistake)
    })
  );

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/user", user);
app.use("/admin", admin);
app.use("/insert_vote",vote);
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
app.use("/", vote);

