import express from "express";
import path from "path";
import multer from "multer";
import { conn, queryAsync } from "../dbconnect";
import { ImageGet, UserGet } from "../model/user_get";
import { escape } from 'sqlstring';
import { Constants } from '../config/constants';
import mysql from "mysql"; 

import { initializeApp } from "firebase/app";
//import { getStorage,ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
export const router = express.Router();

const firebaseConfig = {
  apiKey: "AIzaSyDKHFHiBhRag4Ll8Uv5F9P5zPwJSld6iBI",
  authDomain: "projectwebadv.firebaseapp.com",
  projectId: "projectwebadv",
  storageBucket: "projectwebadv.appspot.com",
  messagingSenderId: "436147540585",
  appId: "1:436147540585:web:276b98b409232f187388f8",
  measurementId: "G-TJCMRLGZ91"
};

initializeApp(firebaseConfig);
const storage = getStorage();



class FileMiddleware {
  filename = "";  
  
  public readonly diskLoader = multer({
    //
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 67108864, // 64 MByte
  },

  // public readonly diskLoader = multer({
  //   storage: multer.diskStorage({
  //     destination: (_req, _file, cb) => {
  //       cb(null, path.join(__dirname, "../uploads"));
  //     },
  //     filename: (req, file, cb) => {
  //       const uniqueSuffix =
  //         Date.now() + "-" + Math.round(Math.random() * 10000);
  //       this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
  //       cb(null, this.filename);
  //     },
  //   }),
  //   limits: {
  //     fileSize: 67108864, // 64 MByte
  //   },
  });
}

const fileUpload = new FileMiddleware();
// router.post("/", fileUpload.diskLoader.single("file"), (req, res) => {
//   res.json({ filename: "/uploads/" + fileUpload.filename });
// });


// router.post("/", fileUpload.diskLoader.single("url_image"), (req, res) => {
//   const url_image = res.json({ filename: "/uploads/" + fileUpload.filename });
//   url_image.toString();
//   let User: ImageGet = req.body;
//   const currentDate = new Date().toString();
//   const sql = "INSERT INTO `image` (username,url_image,name_image, date) VALUES (?, ?, ?, ?)";
//   conn.query(sql, [User.username,url_image,User.name_image,currentDate], (err, result) => {
//     if (err) {
//       console.error('Error inserting user:', err);
//       res.status(500).json({ error: 'Error inserting user' });
//     } else {
//       res.status(201).json({ affected_row: result.affectedRows });
//     }
//   });
// });


// import ฟังก์ชัน escapeString จากไลบรารี sqlstring

router.post("/", fileUpload.diskLoader.single("url_image"), async (req, res) => {
  //const url_image = res.json({ filename: "/uploads/" + fileUpload.filename });
  //url_image.toString();
  const filename = Date.now() + "-" + Math.round(Math.random() * 1000) + ".png";
  const storageRef = ref(storage, "/image/" + filename);
  const metadata = { contentType: req.file!.mimetype };
  const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);
  const url = await getDownloadURL(snapshot.ref);

  // บันทึกรูปภาพลงใน Firebase Storage และรับ URL ของรูปภาพ
  const url_image = url;
  console.log(url_image);
  
  
  //const escapedUrlImage: string = escape(url_image);

  let User: ImageGet = req.body;
  const currentDate = new Date().toISOString();
  const sql = "INSERT INTO `image` (username,url_image,name_image, date) VALUES (?, ?, ?, NOW())";
  conn.query(sql, [User.username, url_image, User.name_image], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'Error inserting user' });
    } else {
      res.status(201).json({ affected_row: result.affectedRows });
    }
  });

});

router.put("/", fileUpload.diskLoader.single("url_image"), (req, res) => {
  const url_image = "/uploads/" + fileUpload.filename;
  //const escapedUrlImage: string = escape(url_image);

  let User: ImageGet = req.body;
  const currentDate = new Date().toISOString();
  const sql = "INSERT INTO `image` (username,url_image,name_image, date) VALUES (?, ?, ?, NOW())";
  conn.query(sql, [User.username, url_image, User.name_image], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'Error inserting user' });
    } else {
      res.status(201).json({ affected_row: result.affectedRows });
    }
  });
});


http://localhost:3000/upload/updateavatar/ตามด้วยusername
router.put("/updateavatar/:username", fileUpload.diskLoader.any(), async (req, res) => {
  const image_avatar = "/uploads/" + fileUpload.filename;
  const username = req.params.username;

  // Update only the image_avatar field
  let sql = "UPDATE `user` SET `image_avatar`=? WHERE `username`=?";
  sql = mysql.format(sql, [image_avatar, username]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    else{
      res.status(201).json({ affected_row: result.affectedRows });
    }
    
  });
});




router.get("/picall", async (req, res)=>{
  const username = req.query.username;
  const sql = "select * from image where username = ?";
  conn.query(sql,[username],(err, result)=>{
    res.json(result);
  });
});



