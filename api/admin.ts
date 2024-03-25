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


  router.get('/look/diff/manage', (req, res) => {
    const username = req.query.username;
    // ดึงข้อมูลรูปภาพและคะแนนก่อนการโหวตของวันก่อนหน้า
    const sqlBefore = 'SELECT * FROM vote WHERE day = CURDATE() - INTERVAL 1 DAY ORDER BY score_day DESC ';
    conn.query({sql: sqlBefore, timeout: 60000}, (err, beforeResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching photos for the previous day' });
        }
  
        // ดึงข้อมูลรูปภาพและคะแนนหลังการโหวตของวันปัจจุบัน
        const sqlAfter = 'SELECT * FROM vote WHERE day = CURDATE() ORDER BY score_day DESC';
        conn.query({sql: sqlAfter, timeout: 60000}, (err, afterResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error fetching photos for the current day' });
            }
  
            // คำนวณหาความแตกต่างในอันดับระหว่างวันก่อนหน้าและวันปัจจุบัน
            const rankingsDiff: { id_image: number; score_day: number; diff: number | null; rank_previous: number; rank_current: number }[] = [];  //เก็บข้อมูลผลต่าง
            afterResults.forEach((afterItem: { id_image: number; score_day: number; }, index: number) => { //วนloopผ่านทุกรายการของafterResults
                const beforeIndex = beforeResults.findIndex((item: { id_image: number; }) => item.id_image === afterItem.id_image);  //ค้นหาว่ารายการที่เป็นปัจจุบันนั้นมีอยู่ใน beforeResults มั้ย
                const rank_previous = beforeIndex !== -1 ? beforeIndex + 1 : null;  //indexของbeforeResults
                const rank_current = index + 1; //indexปัจจุบันของafterResults
                const diff = rank_previous !== null ? rank_previous - rank_current : null;
                rankingsDiff.push({ id_image: afterItem.id_image, score_day: afterItem.score_day, diff, rank_previous, rank_current });
            });
            console.log(rankingsDiff);
            res.json(rankingsDiff);
        });
    });
  });