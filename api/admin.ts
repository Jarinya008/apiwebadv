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
    //const sql = "SELECT user.*,image.*,vote.* FROM image INNER JOIN user ON image.username = user.username"
    const sql = 'SELECT user.*, image.*, v1.day AS v1_day, v1.score_day AS v1_score_day, v2.day AS v2_day, v2.score_day AS v2_score_day, CASE     WHEN v1.id_image IS NULL THEN \'NULL\' ELSE v1.id_image END AS v1_id_image,CASE WHEN v2.id_image IS NULL THEN \'NULL\' ELSE v2.id_image END AS v2_id_image FROM image INNER JOIN user ON image.username = user.username LEFT JOIN vote v1 ON v1.id_image = image.id_image AND v1.day <= CURDATE() LEFT JOIN vote v2 ON v2.id_image = image.id_image AND v2.day = DATE_SUB(v1.day, INTERVAL 1 DAY) WHERE user.username = ? ORDER BY v1.vid, v2.vid LIMIT 0, 25;';
    conn.query(sql, [username], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        // Handle error, possibly send an error response
      } else {
        console.log("Query result:", result);
        // Handle successful query result, possibly send a response with the result
        res.json(result);
      }
    });
    // const username=req.query.username;
    // console.log(username);
    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 7);
    // const yesterdayDay = yesterday.getDate();
    // console.log(yesterdayDay);
    // const yesterdayMonth = yesterday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
    // const yesterdayYear = yesterday.getFullYear();
    // const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
    // const query: string ="SELECT * FROM vote JOIN image ON vote.id_image = image.id_image JOIN user ON image.username = user.username where user.username = ? and vote.day>=? ORDER BY image.id_image,vote.day";
             
    // conn.query(query, [username,formattedYesterday], (err: any, results: any) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(500).json({ error: 'Error fetching votes' });
    //     }
        
    //     const imageStatistics: any[] = [];
    //     let currentImage: any = null;  //ภาพที่จะตรวจสอบ
        
    //     for (const row of results) {
    //         if (!currentImage || currentImage.id_image !== row.id_image) { //ถ้าไม่ใช้รูปปัจจุบันก็จะสร้างobjectขึ้นมาใหม่แบบนี้
    //             currentImage = {
    //                 username: row.username,
    //                 image_avatar: row.image_avatar,
    //                 id_image: row.id_image,
    //                 date: row.date,
    //                 score_image: row.score_image,
    //                 url_image: row.url_image,
    //                 name_image: row.name_image,
    //                 vote: [] 
    //             };

    //             imageStatistics.push(currentImage);
    //         }
            
    //         currentImage.vote.push({ day: row.day, score_day: row.score_day });
    //     }
    //     console.log(imageStatistics);
    //     res.json(imageStatistics);
    // }); 
    // const sqlBefore = 'SELECT * FROM vote WHERE day = CURDATE() - INTERVAL 1 DAY ORDER BY score_day DESC ';
    // conn.query({sql: sqlBefore, timeout: 60000}, (err, beforeResults) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(500).json({ error: 'Error fetching photos for the previous day' });
    //     }
  
    //     // ดึงข้อมูลรูปภาพและคะแนนหลังการโหวตของวันปัจจุบัน
    //     const sqlAfter = 'SELECT * FROM vote WHERE day = CURDATE() ORDER BY score_day DESC';
    //     conn.query({sql: sqlAfter, timeout: 60000}, (err, afterResults) => {
    //         if (err) {
    //             console.error(err);
    //             return res.status(500).json({ error: 'Error fetching photos for the current day' });
    //         }
  
    //         // คำนวณหาความแตกต่างในอันดับระหว่างวันก่อนหน้าและวันปัจจุบัน
    //         const rankingsDiff: { id_image: number; score_day: number; diff: number | null; rank_previous: number; rank_current: number }[] = [];  //เก็บข้อมูลผลต่าง
    //         afterResults.forEach((afterItem: { id_image: number; score_day: number; }, index: number) => { //วนloopผ่านทุกรายการของafterResults
    //             const beforeIndex = beforeResults.findIndex((item: { id_image: number; }) => item.id_image === afterItem.id_image);  //ค้นหาว่ารายการที่เป็นปัจจุบันนั้นมีอยู่ใน beforeResults มั้ย
    //             const rank_previous = beforeIndex !== -1 ? beforeIndex + 1 : null;  //indexของbeforeResults
    //             const rank_current = index + 1; //indexปัจจุบันของafterResults
    //             const diff = rank_previous !== null ? rank_previous - rank_current : null;
    //             rankingsDiff.push({ id_image: afterItem.id_image, score_day: afterItem.score_day, diff, rank_previous, rank_current });
    //         });
    //         console.log(rankingsDiff);
    //         res.json(rankingsDiff);
    //     });
    // });
  });