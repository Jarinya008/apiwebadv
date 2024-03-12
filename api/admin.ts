import express from "express";
import path from "path";
import multer from "multer";
import { conn } from "../dbconnect";
import { ImageGet } from "../model/user_get";
import { escape } from 'sqlstring';
export const router = express.Router();

router.get("/manage/userup", async (req, res)=>{
    const sql = "SELECT image.*, user.* FROM image INNER JOIN user ON image.username = user.username";
    conn.query(sql,(err, result)=>{
      res.json(result);
    });
  });
  router.get("/manage/user", async (req, res)=>{
    const sql = "SELECT * from user where type != 'admin'";
    conn.query(sql,(err, result)=>{
      res.json(result);
    });
  });