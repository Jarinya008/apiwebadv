import express from "express";
import path from "path";
import multer from "multer";
import { conn, queryAsync } from "../dbconnect";
import { ImageGet, UserGet } from "../model/user_get";
import { escape } from 'sqlstring';
import { Constants } from '../config/constants';
import mysql from "mysql"; 
export const router = express.Router();

class FileMiddleware {
  filename = "";
  public readonly diskLoader = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix =
          Date.now() + "-" + Math.round(Math.random() * 10000);
        this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
        cb(null, this.filename);
      },
    }),
    limits: {
      fileSize: 67108864, // 64 MByte
    },
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

router.post("/", fileUpload.diskLoader.single("url_image"), (req, res) => {
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

// router.put("updateavatar/:username",fileUpload.diskLoader.single("image_avatar"), async(req,res)=>{
//   const image_avatar = "/uploads/" + fileUpload.filename;
//   //receive data
//   const usernam = +req.params.usernam;
//   const user : UserGet = req.body;
//   //get original data from table by id
//   let sql = "select * from user where username = ?";
//   sql = mysql.format(sql,[usernam]);

//   //query and wait for result
//   const result = await queryAsync(sql);
//   const jsonStr = JSON.stringify(result);
//   const jsonObj = JSON.parse(jsonStr);
//   console.log(JSON.stringify(result));
//   const userOriginal : UserGet = jsonObj[0];
//   const updateUser = {...userOriginal, ...user};

//   sql =
//       "update  `user` set `username`=?, `image_avatar`=?, `password`=?, `type`=?";
//     sql = mysql.format(sql, [
//       updateUser.username,
//       image_avatar,
//       updateUser.password,
//       updateUser.type
//     ]);
//     conn.query(sql, (err, result) => {
//       if (err) throw err;
//       res.status(201).json({ affected_row: result.affectedRows });
//     });
// })

// router.put("/updateavatar/:username", fileUpload.diskLoader.single("image_avatar"), async (req, res) => {
//   const image_avatar = "/uploads/" + fileUpload.filename;
//   // receive data
//   const username = req.params.username; // corrected variable name
//   const user = req.body;

//   // get original data from table by username
//   let sql = "SELECT * FROM user WHERE username = ?";
//   sql = mysql.format(sql, [username]);

//   // query and wait for result
//   conn.query(sql, async (err, result) => {
//     if (err) throw err;

//     const userOriginal = result[0];
//     const updateUser = { ...userOriginal, ...user };

//     sql = "UPDATE `user` SET `username`=?, `image_avatar`=?, `password`=?, `type`=?";
//     sql = mysql.format(sql, [
//       username,
//       image_avatar,
//       updateUser.password,
//       updateUser.type
//     ]);

//     conn.query(sql, (err, result) => {
//       if (err) throw err;
//       res.status(201).json({ affected_row: result.affectedRows });
//     });
//   });
// });

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



