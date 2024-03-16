import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { UserGet } from "../model/user_get";
import mysql from "mysql"; 
import multer from "multer";
import path from "path";
export const router = express.Router();

// router.get('/', (req, res)=>{
//     if(req.query.id){
//         const id = req.query.id;
//         const name = req.query.name;
//         res.send('Method GET in trip.ts with ${id} ${name}');
//       }
//       else{
//         const sql = "select * from user";
//         conn.query(sql,(err, result)=>{
//           if(err){
//             res.json(err);
//           }else{
//             res.json(result);
//           }
//         });
//       }
// });

router.get("/:login", async (req, res)=>{
  //receive data
  const username = req.query.username;
  const password = req.query.password;
  const sql = "select * from user WHERE username = ? AND password = ?";
  conn.query(sql,[username,password],(err, result)=>{
    res.json(result);
});
});

//http://localhost:3000/user/manage/yourimage?username=
router.get("/manage/yourimage", async (req, res)=>{
  const username = req.query.username;
  const sql = "select * from image WHERE username = ?";
  conn.query(sql,[username],(err, result)=>{
    res.json(result);
  });
});

router.get("/yesterday/score", (req, res) => {
  const id_image = req.query.id_image;

      // ค้นหาคะแนนของวันที่เมื่อวาน
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDay = yesterday.getDate();
      console.log(yesterdayDay);
      
      const yesterdayMonth = yesterday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
      const yesterdayYear = yesterday.getFullYear();
      const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
console.log(formattedYesterday);

      conn.query("SELECT score_day FROM vote WHERE day = ? AND id_image = ?", [formattedYesterday, id_image], (error, yesterdayResults) => {
          if (error) {
              return res.status(500).json({ error: "An error occurred while fetching yesterday's score" });
          }

          if (yesterdayResults.length === 0) {
              return res.status(404).json({ error: "No data found for yesterday" });
          }

          res.json({ yesterdayScore: yesterdayResults });
  });
});

router.get("/today/score", (req, res) => {
  const id_image = req.query.id_image;

      // ค้นหาคะแนนของวันที่เมื่อวาน
      const todayday = new Date();
      const todayDay = todayday.getDate();
      console.log(todayDay);
      
      const todayMonth = todayday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
      const todayYear = todayday.getFullYear();
      const formattedtodayResults = `${todayYear}-${todayMonth}-${todayDay}`;
console.log(formattedtodayResults);

      conn.query("SELECT score_day FROM vote WHERE day = ? AND id_image = ?", [formattedtodayResults, id_image], (error, todayResults) => {
          if (error) {
              return res.status(500).json({ error: "An error occurred while fetching yesterday's score" });
          }

          if (todayResults.length === 0) {
              return res.status(404).json({ error: "No data found for yesterday" });
          }

          res.json({ todayResultsScore: todayResults });
  });
});



router.get("/today/scorerank", (req, res) => {
  const id_image = req.query.id_image;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);

  conn.query("SELECT score_day FROM vote WHERE day = ? AND id_image = ?", [formattedDate, id_image], (error, todayResults) => {
      if (error) {
          return res.status(500).json({ error: "An error occurred while fetching today's score" });
      }

      if (todayResults.length === 0) {
          return res.status(404).json({ error: "No data found for today" });
      }

      // ค้นหาคะแนนของวันที่เมื่อวาน
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDay = yesterday.getDate();
      console.log(yesterdayDay);
      
      const yesterdayMonth = yesterday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
      const yesterdayYear = yesterday.getFullYear();
      const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
console.log(formattedYesterday);

      conn.query("SELECT score_day FROM vote WHERE day = ? AND id_image = ?", [formattedYesterday, id_image], (error, yesterdayResults) => {
          if (error) {
              return res.status(500).json({ error: "An error occurred while fetching yesterday's score" });
          }

          if (yesterdayResults.length === 0) {
              return res.status(404).json({ error: "No data found for yesterday" });
          }

          // คำนวณคะแนนของวันที่เมื่อวานจากคะแนนของวันนี้ลบด้วยคะแนนของวันเมื่อวาน
          const yesterdayScore = todayResults[0].score_day - yesterdayResults[0].score_day;

          res.json({ yesterdayScore: yesterdayScore });
      });
  });
});

router.get("/topten/today",(req,res) => {
  const currentDate = new Date();
  const day = currentDate.getDate()+1;
  const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 7);
  const yesterdayDay = yesterday.getDate();
  console.log(yesterdayDay);
  const yesterdayMonth = yesterday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
  const yesterdayYear = yesterday.getFullYear();
  const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

  const sql = "SELECT * FROM vote,image where vote.day = ? AND vote.id_image = image.id_image ORDER BY vote.score_day DESC LIMIT 10";
  conn.query(sql,[formattedDate],(err, result)=>{
    if (err) {
      res.status(500).json({ error: "An error occurred while processing your request" });
      return;
    }
    res.json(result);
});



  // const currentDate = new Date();
  // const day = currentDate.getDate();
  // const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
  // const year = currentDate.getFullYear();
  // const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate);
  
  // const sql = "SELECT * FROM vote where day = ? ORDER BY score_day DESC LIMIT 10";
  // conn.query(sql,[formattedDate],(err, result)=>{
  //   if (err) {
  //     res.status(500).json({ error: "An error occurred while processing your request" });
  //     return;
  //   }

  //   const imagePromises = result.map((row: { id_image: any; }) => {
  //     return new Promise((resolve, reject) => {
  //       const imageSql = "SELECT * FROM image WHERE id_image = ?";
  //       conn.query(imageSql, [row.id_image], (imageErr, imageResult) => {
  //         if (imageErr) {
  //           reject(imageErr);
  //           return;
  //         }
  //         resolve(imageResult);
  //       });
  //     });
  //   });

  //   Promise.all(imagePromises)
  //     .then(imageResults => {
  //       const finalResult = result.map((row: any, index: number) => {
  //         return {
  //           ...row,
  //           image: imageResults[index]
  //         };
  //       });
  //       res.json(finalResult);
  //     })
  //     .catch(err => {
  //       res.status(500).json({ error: "An error occurred while processing your request" });
  //     });
  // });
});

// router.get("/score/seven",(req,res) =>{
//   const username = req.query.username;
//   console.log(username);
  
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 7);
//   const yesterdayDay = yesterday.getDate();
//   console.log(yesterdayDay);
//   const yesterdayMonth = yesterday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
//   const yesterdayYear = yesterday.getFullYear();
//   const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

//   const currentDate = new Date();
//   const day = currentDate.getDate();
//   const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
//   const year = currentDate.getFullYear();
//   const formattedDate = `${year}-${month}-${day}`;
//   console.log(formattedDate);
  
//   const sql = 'SELECT * FROM vote JOIN image ON vote.id_image = image.id_image JOIN user ON image.username = user.username where user.username = ? ORDER BY image.id_image';
//   conn.query(sql,[username],(err, result)=>{
//       //res.json(result);
//       // const sql = 'select * from image,vote where vote.day >= ?';
//       // conn.query(sql,[formattedYesterday, result.id_image],(err, result)=>{
//           res.json(result);
//           console.log(result);
          
//       // })
//   })
// });

router.get("/score/seven",(req,res) =>{
  // const username = req.query.username;
  // console.log(username);
  
  // const yesterday = new Date();
  // yesterday.setDate(yesterday.getDate() - 7);
  // const yesterdayDay = yesterday.getDate();
  // console.log(yesterdayDay);
  // const yesterdayMonth = yesterday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
  // const yesterdayYear = yesterday.getFullYear();
  // const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

  // const currentDate = new Date();
  // const day = currentDate.getDate();
  // const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
  // const year = currentDate.getFullYear();
  // const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate);
  
  // const sql: string = 'SELECT * FROM vote JOIN image ON vote.id_image = image.id_image JOIN user ON image.username = user.username where user.username = ? ORDER BY image.id_image';
  // conn.query(sql,[username],(err, results) => {
  //     if (err) {
  //       console.error(err);
  //       res.status(500).send('Internal Server Error');
  //       return;
  //     }
      
  //     res.json(results);
  //     console.log(results);

  //     // const mergedResults:any = {};

  //     // results.forEach((row: { id_image: number; }) => {
  //     //   const id_image = row.id_image;
  //     //   if (!mergedResults[id_image]) {
  //     //     mergedResults[id_image] = [];
  //     //   }
  //     //   mergedResults[id_image].push(row);
  //     // });
  //     // console.log(mergedResults);
  //     // res.json(mergedResults);
  // });




    const username=req.query.username;
    console.log(username);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 7);
    const yesterdayDay = yesterday.getDate();
    console.log(yesterdayDay);
    const yesterdayMonth = yesterday.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
    const yesterdayYear = yesterday.getFullYear();
    const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
// const query: string = `
//              SELECT image.id_image, image.date, image.score_image, image.url_image, image.name_image, vote.day, vote.score_day
//              FROM vote
//              INNER JOIN image ON vote.id_image = image.id_image 
//              WHERE vote.day >= ? AND image.username = ? 
//              ORDER BY image.id_image, vote.day`;
const query: string ="SELECT * FROM vote JOIN image ON vote.id_image = image.id_image JOIN user ON image.username = user.username where user.username = ? and vote.day>=? ORDER BY image.id_image,vote.day";
             
conn.query(query, [username,formattedYesterday], (err: any, results: any) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching votes' });
    }
    
    const imageStatistics: any[] = [];
    let currentImage: any = null;
    
    for (const row of results) {
        if (!currentImage || currentImage.id_image !== row.id_image) {
            currentImage = {
                id_image: row.id_image,
                date: row.date,
                score_image: row.score_image,
                url_image: row.url_image,
                name_image: row.name_image,
                vote: [] 
            };
            imageStatistics.push(currentImage);
        }
        currentImage.vote.push({ day: row.day, score_day: row.score_day });
    }
    console.log(imageStatistics);
    res.json(imageStatistics);
});


});




router.get("/topten/yesterday",(req,res) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDay = yesterday.getDate();
  const yesterdayMonth = yesterday.getMonth() + 1;
  const yesterdayYear = yesterday.getFullYear();
  const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
  console.log(formattedYesterday);
  
  const sql = "SELECT * FROM vote where day = ? ORDER BY score_day DESC LIMIT 10";
  conn.query(sql,[formattedYesterday],(err, result)=>{
    if (err) {
      res.status(500).json({ error: "An error occurred while processing your request" });
      return;
    }

    const imagePromises = result.map((row: { id_image: any; }) => {
      return new Promise((resolve, reject) => {
        const imageSql = "SELECT * FROM image WHERE id_image = ?";
        conn.query(imageSql, [row.id_image], (imageErr, imageResult) => {
          if (imageErr) {
            reject(imageErr);
            return;
          }
          resolve(imageResult);
        });
      });
    });

    Promise.all(imagePromises)
      .then(imageResults => {
        const finalResult = result.map((row: any, index: number) => {
          return {
            ...row,
            image: imageResults[index]
          };
        });
        res.json(finalResult);
      })
      .catch(err => {
        res.status(500).json({ error: "An error occurred while processing your request" });
      });
  });
});


// router.get("/topten/yesterday",(req,res) => {
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   const yesterdayDay = yesterday.getDate();
//   const yesterdayMonth = yesterday.getMonth() + 1;
//   const yesterdayYear = yesterday.getFullYear();
//   const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
//   console.log(formattedYesterday);
  
//   const sql = "SELECT * FROM vote where day = ? ORDER BY score_day DESC LIMIT 10";
//   conn.query(sql,[formattedYesterday],(err, result)=>{
//     res.json(result);
//     console.log(result);
//   });
// });

// router.get("/check/yourimage", async (req, res)=>{
//   const username = req.query.username;
//   const sql = "select * from image WHERE username = ?";
//   conn.query(sql,[username],(err, result)=>{
//     res.json(result);
//   });
// });

router.post('/', (req, res) => {
  let User: UserGet = req.body;
  const sql = "INSERT INTO `user` (`username`, `image_avatar`, `password`) VALUES (?, '/uploads/1709147540460-1083.jpg', ?)";
  conn.query(sql, [User.username, User.password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'Error inserting user' });
    } else {
      res.status(201).json({ affected_row: result.affectedRows });
    }
  });
});


//http://localhost:3000/user/delete?id_image=
// router.delete("/delete", (req, res) => {
//   const id_image = req.query.id_image;
//   const sql = "delete from image where id_image = ?";
//   conn.query(sql, [id_image], (err, result) => {
//     if (err) {
//       console.error('Error deleting image:', err);
//       res.status(500).json({ error: 'Error deleting image' });
//     } else {
//       const sql2 = "delete from vote where id_image = ?";
//       conn.query(sql2, [id_image], (err, result) => {
//         if (err) {
//           console.error('Error deleting image:', err);
//           res.status(500).json({ error: 'Error deleting image' });
//         } else {
//           res.json(result);
//         }
//       });
//       res.json(result);
//     }
//   });
// });

router.delete("/delete", (req, res) => {
  const id_image = req.query.id_image;
  const sql = "DELETE FROM image WHERE id_image = ?";
  conn.query(sql, [id_image], (err, result1) => {
    if (err) {
      console.error('Error deleting image:', err);
      res.status(500).json({ error: 'Error deleting image' });
      return; // Return to prevent further execution
    }res.json(result1);
      console.log(result1);
    });
});
router.delete("/", (req, res) => {
  const id_image = req.query.id_image;
  const sql = "DELETE FROM vote WHERE id_image = ?";
  conn.query(sql, [id_image], (err, result) => {
    if (err) {
      console.error('Error deleting vote:', err);
      res.status(500).json({ error: 'Error deleting vote' });
      return; // Return to prevent further execution
    }
    res.json(result);
    console.log(result);
  });
});





router.get('/look/diff/top', (req, res) => {
  // ดึงข้อมูลรูปภาพและคะแนนก่อนการโหวตของวันก่อนหน้า
  const sqlBefore = 'SELECT * FROM vote WHERE day = CURDATE() - INTERVAL 1 DAY ORDER BY score_day DESC ';
  conn.query({sql: sqlBefore, timeout: 60000}, (err, beforeResults) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error fetching photos for the previous day' });
      }

      // ดึงข้อมูลรูปภาพและคะแนนหลังการโหวตของวันปัจจุบัน
      const sqlAfter = 'SELECT * FROM vote WHERE day = CURDATE() ORDER BY score_day DESC LIMIT 10';
      conn.query({sql: sqlAfter, timeout: 60000}, (err, afterResults) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error fetching photos for the current day' });
          }

          // คำนวณหาความแตกต่างในอันดับระหว่างวันก่อนหน้าและวันปัจจุบัน
          const rankingsDiff: { id_image: number; score_day: number; diff: number | null; rank_previous: number; rank_current: number }[] = [];
          afterResults.forEach((afterItem: { id_image: number; score_day: number; }, index: number) => {
              const beforeIndex = beforeResults.findIndex((item: { id_image: number; }) => item.id_image === afterItem.id_image);
              const rank_previous = beforeIndex !== -1 ? beforeIndex + 1 : null;
              const rank_current = index + 1;
              const diff = rank_previous !== null ? rank_previous - rank_current : null;
              rankingsDiff.push({ id_image: afterItem.id_image, score_day: afterItem.score_day, diff, rank_previous, rank_current });
          });
          console.log(rankingsDiff);
          res.json(rankingsDiff);
      });
  });
});




