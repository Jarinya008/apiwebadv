import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { ImageGet, UserGet } from "../model/user_get";
import mysql from "mysql";
import multer from "multer";
import path from "path";
import fs from "fs";
export const router = express.Router();
const upload = multer({ dest: "uploads/" }); // ใช้ multer เพื่อจัดการการ upload ไฟล์
let pic1 = "";
let pic2 = "";

router.post("/:voteimage/elo", (req, res) => {
  const id_image1 = req.body.id_image1;
  const id_image2 = req.body.id_image2;
  const point1 = req.body.point1;
  const point2 = req.body.point2;
  const rpa = req.body.rpa;
  const rpb = req.body.rpb;
  //let ra: number, rb: number;
console.log(rpa);
console.log(rpb);

if(point1 == 1){
  conn.query(
    "SELECT * FROM image WHERE id_image = ?",
    [id_image1],
    (error, results1) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "An error occurred while fetching image1" });
      }

      conn.query(
        "SELECT * FROM image WHERE id_image = ?",
        [id_image2],
        (error, results2) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "An error occurred while fetching image2" });
          }else{

            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
            const year = currentDate.getFullYear();
            const formattedDate = `${year}-${month}-${day}`;
            console.log(formattedDate);
            conn.query("SELECT day FROM vote WHERE day = CURDATE() AND id_image = ?",[results1[0].id_image],(error, results3) => {
              if (error) {
                return res.status(500).json({ error: "An error occurred while fetching image1" });
              }else{
                //console.log('re3 = '+results3.length);
                if(results3.length == 0){
                  const sql = "INSERT INTO `vote` (`id_image`, `score_day`, `day`) VALUES (?, ?, CURDATE())";
                  conn.query(sql,[id_image1, rpa],
                    (err, result) => {
                      if (err) {
                        console.error("Error inserting user:", err);
                        res.status(500).json({ error: "Error inserting user" });
                      } else {  
                        const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpa, id_image1], (err, result) => {
                          if (err) {
                            console.error("Error inserting user:", err);
                            return res.status(500).json({ error: "Error inserting user" });
                          }
                        });
                      }                
                  });
                }else{
                  const sql = "UPDATE `vote` SET `score_day`= ? WHERE `id_image`= ? AND day = ?";
                  conn.query(sql,[rpa, id_image1,formattedDate],(err, result) => {
                      if (err) {
                        console.error("Error inserting user:", err);
                        res.status(500).json({ error: "Error inserting user" });
                      } else {  
                        const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpa, id_image1], (err, result) => {
                          if (err) {
                            console.error("Error inserting user:", err);
                            return res.status(500).json({ error: "Error inserting user" });
                          }
                        });
                      }                
                  });
                }

                


                conn.query("SELECT day FROM vote WHERE day = CURDATE() AND id_image = ?",[results2[0].id_image],(error, results4) => {
                  if (error) {
                    return res.status(500).json({ error: "An error occurred while fetching image1" });
                  }else{
                    //console.log('re3 = '+results3.length);
                    // if(results4.length == 0){
                      // const sql = "INSERT INTO `vote` (`id_image`, `score_day`, `day`) VALUES (?, ?, ?)";
                      // conn.query(sql,[id_image2, rpb, formattedDate],
                      //   (err, result) => {
                      //     if (err) {
                      //       console.error("Error inserting user:", err);
                      //       res.status(500).json({ error: "Error inserting user" });
                      //     } else {  
                      //       const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpb, id_image2], (err, result) => {
                      //         if (err) {
                      //           console.error("Error inserting user:", err);
                      //           return res.status(500).json({ error: "Error inserting user" });
                      //         }
                      //       });
                      //     }                
                      // });
                    // }else{
                    //   const sql = "UPDATE `vote` SET `score_day`= ? WHERE `id_image`= ? AND day = ?";
                    //   conn.query(sql,[rpb, id_image2,formattedDate],(err, result) => {
                    //       if (err) {
                    //         console.error("Error inserting user:", err);
                    //         res.status(500).json({ error: "Error inserting user" });
                    //       } else {  
                            const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpb, id_image2], (err, result) => {
                              if (err) {
                                console.error("Error inserting user:", err);
                                return res.status(500).json({ error: "Error inserting user" });
                              }
                            });
                    //       }                
                    //   });
                    // }
                   }
                });
              }
            });
          }
        });
    });
  } else if(point2 == 1){
    conn.query(
      "SELECT * FROM image WHERE id_image = ?",
      [id_image1],
      (error, results1) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "An error occurred while fetching image1" });
        }
  
        conn.query(
          "SELECT * FROM image WHERE id_image = ?",
          [id_image2],
          (error, results2) => {
            if (error) {
              return res
                .status(500)
                .json({ error: "An error occurred while fetching image2" });
            }else{
  
              const currentDate = new Date();
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
              const year = currentDate.getFullYear();
              const formattedDate = `${year}-${month}-${day}`;
              console.log(formattedDate);
              conn.query("SELECT day FROM vote WHERE day = CURDATE() AND id_image = ?",[results2[0].id_image],(error, results3) => {
                if (error) {
                  return res.status(500).json({ error: "An error occurred while fetching image1" });
                }else{
                  //console.log('re3 = '+results3.length);
                  if(results3.length == 0){
                    const sql = "INSERT INTO `vote` (`id_image`, `score_day`, `day`) VALUES (?, ?, CURDATE())";
                    conn.query(sql,[id_image2, rpb],(err, result) => {
                        if (err) {
                          console.error("Error inserting user:", err);
                          res.status(500).json({ error: "Error inserting user" });
                        } else {  
                          const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpb, id_image2], (err, result) => {
                            if (err) {
                              console.error("Error inserting user:", err);
                              return res.status(500).json({ error: "Error inserting user" });
                            }
                          });
                        }                
                    });
                  }else{
                    const sql = "UPDATE `vote` SET `score_day`= ? WHERE `id_image`= ? AND day = ?";
                    conn.query(sql,[rpb, id_image2,formattedDate],(err, result) => {
                        if (err) {
                          console.error("Error inserting user:", err);
                          res.status(500).json({ error: "Error inserting user" });
                        } else {  
                          const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpb, id_image2], (err, result) => {
                            if (err) {
                              console.error("Error inserting user:", err);
                              return res.status(500).json({ error: "Error inserting user" });
                            }
                          });
                        }                
                    });
                  }
  
                  
  
  
                  conn.query("SELECT day FROM vote WHERE day = CURDATE() AND id_image = ?",[results1[0].id_image],(error, results4) => {
                    if (error) {
                      return res.status(500).json({ error: "An error occurred while fetching image1" });
                    }else{
                      //console.log('re3 = '+results3.length);
                      // if(results4.length == 0){
                        // const sql = "INSERT INTO `vote` (`id_image`, `score_day`, `day`) VALUES (?, ?, ?)";
                        // conn.query(sql,[id_image2, rpb, formattedDate],
                        //   (err, result) => {
                        //     if (err) {
                        //       console.error("Error inserting user:", err);
                        //       res.status(500).json({ error: "Error inserting user" });
                        //     } else {  
                        //       const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpb, id_image2], (err, result) => {
                        //         if (err) {
                        //           console.error("Error inserting user:", err);
                        //           return res.status(500).json({ error: "Error inserting user" });
                        //         }
                        //       });
                        //     }                
                        // });
                      // }else{
                      //   const sql = "UPDATE `vote` SET `score_day`= ? WHERE `id_image`= ? AND day = ?";
                      //   conn.query(sql,[rpb, id_image2,formattedDate],(err, result) => {
                      //       if (err) {
                      //         console.error("Error inserting user:", err);
                      //         res.status(500).json({ error: "Error inserting user" });
                      //       } else {  
                              const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpa, id_image1], (err, result) => {
                                if (err) {
                                  console.error("Error inserting user:", err);
                                  return res.status(500).json({ error: "Error inserting user" });
                                }
                              });
                      //       }                
                      //   });
                      // }
                     }
                  });
                }
              });
            }
          });
      });
    }



































  // conn.query(
  //   "SELECT * FROM image WHERE id_image = ?",
  //   [id_image1],
  //   (error, results1) => {
  //     if (error) {
  //       return res
  //         .status(500)
  //         .json({ error: "An error occurred while fetching image1" });
  //     }

  //     conn.query(
  //       "SELECT * FROM image WHERE id_image = ?",
  //       [id_image2],
  //       (error, results2) => {
  //         if (error) {
  //           return res
  //             .status(500)
  //             .json({ error: "An error occurred while fetching image2" });
  //         }else{

  //           const currentDate = new Date();
  //           const day = currentDate.getDate();
  //           const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
  //           const year = currentDate.getFullYear();
  //           const formattedDate = `${year}-${month}-${day}`;
  //           console.log(formattedDate);
  //           conn.query("SELECT day FROM vote WHERE day = ? AND id_image = ?",[formattedDate, results1[0].id_image],(error, results3) => {
  //             if (error) {
  //               return res.status(500).json({ error: "An error occurred while fetching image1" });
  //             }else{
  //               //console.log('re3 = '+results3.length);
  //               if(results3.length == 0){
  //                 const sql = "INSERT INTO `vote` (`id_image`, `score_day`, `day`) VALUES (?, ?, ?)";
  //                 conn.query(sql,[id_image1, rpa, formattedDate],
  //                   (err, result) => {
  //                     if (err) {
  //                       console.error("Error inserting user:", err);
  //                       res.status(500).json({ error: "Error inserting user" });
  //                     } else {  
  //                       const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpa, id_image1], (err, result) => {
  //                         if (err) {
  //                           console.error("Error inserting user:", err);
  //                           return res.status(500).json({ error: "Error inserting user" });
  //                         }
  //                       });
  //                     }                
  //                 });
  //               }else{
  //                 const sql = "UPDATE `vote` SET `score_day`= ? WHERE `id_image`= ? AND day = ?";
  //                 conn.query(sql,[rpa, id_image1,formattedDate],(err, result) => {
  //                     if (err) {
  //                       console.error("Error inserting user:", err);
  //                       res.status(500).json({ error: "Error inserting user" });
  //                     } else {  
  //                       const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpa, id_image1], (err, result) => {
  //                         if (err) {
  //                           console.error("Error inserting user:", err);
  //                           return res.status(500).json({ error: "Error inserting user" });
  //                         }
  //                       });
  //                     }                
  //                 });
  //               }

                


  //               conn.query("SELECT day FROM vote WHERE day = ? AND id_image = ?",[formattedDate, results2[0].id_image],(error, results4) => {
  //                 if (error) {
  //                   return res.status(500).json({ error: "An error occurred while fetching image1" });
  //                 }else{
  //                   //console.log('re3 = '+results3.length);
  //                   if(results4.length == 0){
  //                     const sql = "INSERT INTO `vote` (`id_image`, `score_day`, `day`) VALUES (?, ?, ?)";
  //                     conn.query(sql,[id_image2, rpb, formattedDate],
  //                       (err, result) => {
  //                         if (err) {
  //                           console.error("Error inserting user:", err);
  //                           res.status(500).json({ error: "Error inserting user" });
  //                         } else {  
  //                           const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpb, id_image2], (err, result) => {
  //                             if (err) {
  //                               console.error("Error inserting user:", err);
  //                               return res.status(500).json({ error: "Error inserting user" });
  //                             }
  //                           });
  //                         }                
  //                     });
  //                   }else{
  //                     const sql = "UPDATE `vote` SET `score_day`= ? WHERE `id_image`= ? AND day = ?";
  //                     conn.query(sql,[rpb, id_image2,formattedDate],(err, result) => {
  //                         if (err) {
  //                           console.error("Error inserting user:", err);
  //                           res.status(500).json({ error: "Error inserting user" });
  //                         } else {  
  //                           const sql ="UPDATE `image` SET `score_image`= ? WHERE `id_image`= ?";conn.query(sql, [rpb, id_image2], (err, result) => {
  //                             if (err) {
  //                               console.error("Error inserting user:", err);
  //                               return res.status(500).json({ error: "Error inserting user" });
  //                             }
  //                           });
  //                         }                
  //                     });
  //                   }
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //   });
  //}




  
});






router.get("/random-image", (req, res) => {
  let pic1: any[] = [];
  conn.query(
    "SELECT * FROM image ORDER BY RAND() LIMIT 1",
    (error, results, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "An error occurred while fetching the random image" });
      }
      pic1[0] = results[0]; // เก็บรูปภาพที่สุ่มมาแรก
      // เมื่อรับผลลัพธ์แล้วทำการ query รูปภาพที่สุ่มมาที่สองและต้องไม่ซ้ำกับรูปที่สุ่มมาแรก
      conn.query(
        "SELECT * FROM image WHERE id_image != ? ORDER BY RAND() LIMIT 1",
        [pic1[0].id_image],
        (error, results, fields) => {
          if (error) {
            return res.status(500).json({
              error: "An error occurred while fetching the random image",
            });
          }
          pic1[1] = results[0]; // เก็บรูปภาพที่สุ่มมาที่สอง
          // ส่ง JSON response กลับไปพร้อมกับรูปภาพทั้งสอง
          
          return res.json({ pic1 });
          
        }
      );
    }
  );
  
  
});

//http://localhost:3000/delete?id_image=
router.delete("/delete", (req, res) => {
  const id_image = req.query.id_image;
  const sql = "delete from image where id_image = ?";
  conn.query(sql, [id_image], (err, result) => {
    if (err) {
      console.error("Error deleting image:", err);
      res.status(500).json({ error: "Error deleting image" });
    } else {
      res.json(result);
    }
  });
});

// // คำนวณคะแนนโดยใช้ Elo Algorithm
// const kFactor = 32; // ค่า K-factor ที่กำหนดเอง

// function calculateEloRating(playerRating: number, opponentRating: number, result: number): number {
//     const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
//     const newRating = playerRating + kFactor * (result - expectedScore);
//     return Math.round(newRating);
// }

// // สร้างฟังก์ชันสำหรับการรับค่าการโหวตและคำนวณคะแนน
// router.post('/voteimage', (req, res) => {
//   const { name_image, score_day, result } = req.body;

//   // ค้นหาคะแนนปัจจุบันของรูปภาพจากฐานข้อมูล
//   const getPlayerRatingQuery = 'SELECT score_image FROM image WHERE name_image = ?';
//   conn.query(getPlayerRatingQuery, [name_image], (err, playerResult) => {
//     if (err) {
//       console.error('Error getting player rating: ', err);
//       res.status(500).json({ message: 'Error getting player rating' });
//     } else {
//       const playerRating = playerResult[0];

//       // คำนวณคะแนนโดยใช้ Elo Algorithm
//       const opponentRating = 1200; // คะแนนของผู้เล่นอื่นๆที่กำหนดในตัวอย่าง
//       const newRating = calculateEloRating(playerRating, opponentRating, result);

//       // เพิ่มข้อมูลลงในฐานข้อมูล
//       const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
//       const insertVoteQuery = 'INSERT INTO vote (name_image, score_day, date) VALUES (?, ?, ?)';
//       conn.query(insertVoteQuery, [name_image, score_day, date], (err, result) => {
//         if (err) {
//           console.error('Error inserting data: ', err);
//           res.status(500).json({ message: 'Error inserting data' });
//         } else {
//           res.status(200).json({ message: 'Vote recorded successfully', newRating: newRating });
//         }
//       });
//     }
//   });
// });
