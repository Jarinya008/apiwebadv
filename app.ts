import express from "express";
import { router as user } from "./api/user";
import { router as upload } from "./api/upload";
import { router as vote } from "./api/vote";
import { router as admin } from "./api/admin";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();
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

