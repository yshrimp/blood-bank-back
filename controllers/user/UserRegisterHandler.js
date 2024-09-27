// //module export
// const UserRegisterHandler = (app, db) => {
//   app.post("/reg/usr", (req, res) => {
//     //variables
//     const userFName = req.body.userFName;
//     const userAge = req.body.userAge;
//     const userGender = req.body.userGender;
//     const userBloodGroup = req.body.userBloodGroup;
//     const userPhone = req.body.userPhone;
//     const userMail = req.body.userMail;
//     const userPlace = req.body.userPlace;
//     const userUserName = req.body.userUserName;
//     const userPassword = req.body.userPassword;

//     //query
//     const sqlInsert1 =
//       "INSERT INTO user_details (userFName,userAge,userGender,userBloodGroup,userPhone,userMail,userPlace) VALUES (?,?,?,?,?,?,?)";

//     const sqlInsert2 =
//       "INSERT INTO user_login (user_id,userUserName,userPassword) VALUES (?,?,?)";

//     const sqlInsert3 = "INSERT INTO user_health (user_id) VALUES(?)";

//     const sqlDelete1 = "DELETE  FROM user_details WHERE user_id= ?";

//     const sqlDelete2 = "DELETE FROM user_health WHERE user_id=?";
//     /////
//     db.query(
//       sqlInsert1,
//       [
//         userFName,
//         userAge,
//         userGender,
//         userBloodGroup,
//         userPhone,
//         userMail,
//         userPlace,
//       ],
//       (err, result) => {
//         if (err) console.log(err + " **ERROR  INSERTING USER** ");
//         else {
//           var user_id = result.insertId;
//           //////
//           db.query(
//             sqlInsert2,
//             [user_id, userUserName, userPassword],
//             (err, result1) => {
//               if (err) {
//                 console.log(err + "**ERROR INSERTING TO USER-LOGIN**");
//                 //////
//                 db.query(sqlDelete1, [user_id], (err, result2) => {
//                   if (err) console.log(err);
//                   else {
//                     console.log("**DELETED DUE TO DUPLICATION**");
//                     res.send({ message: "Username already exist" });
//                   }
//                 });
//               } else {
//                 //res.send({ message: "User Registration Successfull!" });
//                 //console.log("**USER REGISTRATION SUCCESSFULL**");
//                 ///////
//                 db.query(sqlInsert3, [user_id], (err, result1) => {
//                   if (err) {
//                     console.log(err + "**ERROR INSERTING TO USER-LOGIN**");
//                     //////
//                     db.query(sqlDelete2, [user_id], (err, result2) => {
//                       if (err) console.log(err);
//                       else {
//                         console.log("**DELETED DUE TO DUPLICATION**");
//                         res.send({ message: "Username already exist" });
//                       }
//                     });
//                   } else {
//                     res.send({ message: "User Registration Successfull!" });
//                     console.log("**USER REGISTRATION SUCCESSFULL**");
//                   }
//                 });
//               }
//             }
//           );
//         }
//       }
//     );
//   });
// };


// export default UserRegisterHandler;

//module export
const UserRegisterHandler = (app, db) => {
  app.post("/reg/usr", (req, res) => {
    // Cognito에서 받은 username (Cognito에서 생성된 user ID or username)
    const userUserName = req.body.userUserName;

    // 추가 정보
    const userFName = req.body.userFName;
    const userAge = req.body.userAge;
    const userGender = req.body.userGender;
    const userBloodGroup = req.body.userBloodGroup;
    const userPhone = req.body.userPhone;
    const userMail = req.body.userMail;
    const userPlace = req.body.userPlace;

    // 데이터베이스에 저장하는 SQL 쿼리
    const sql = `
      INSERT INTO user_details (userUserName, userFName, userAge, userGender, userBloodGroup, userPhone, userMail, userPlace)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [userUserName, userFName, userAge, userGender, userBloodGroup, userPhone, userMail, userPlace], (err, result) => {
      if (err) {
        console.error('Error saving user info:', err);
        res.status(500).send('Error saving user info');
      } else {
        res.status(200).send('User info saved successfully');
      }
    });
  });
};

module.exports = UserRegisterHandler;
