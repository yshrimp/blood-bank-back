// //module export
// const SearchHandler = (app, db) => {
//   app.post("/home/search", (req, res) => {
//     //variables
//     const blood = req.body.blood;
//     const place = req.body.place;
//     //query
//     //console.log(blood + place);
//     const sqlSelect =
//       "SELECT * FROM user_details WHERE userBloodGroup = ? OR userPlace = ?";

//     //
//     db.query(sqlSelect, [blood, place], (err, result) => {
//       if (err) {
//         console.log("**   SEARCH ERROR   **" + err);
//       }

//       if (result.length > 0) {
//         res.send(result);
//         //console.log("**SEARCH RESULTS FOUND AND SEND TO FRONT END**");
//       } else {
//         res.send({ message: "NO SEARCH RESULTS FOUND!" });
//       }
//     });
//   });
// };

// export default SearchHandler;

const AWS = require('aws-sdk');
const cognitoISP = new AWS.CognitoIdentityServiceProvider();

const getCognitoUsers = async () => {
  const params = {
    UserPoolId: 'your_user_pool_id',
  };

  try {
    const data = await cognitoISP.listUsers(params).promise();
    return data.Users.map(user => {
      const attributes = user.Attributes.reduce((acc, attr) => {
        acc[attr.Name] = attr.Value;
        return acc;
      }, {});
      
      return {
        userName: user.Username,
        fullName: attributes.name,  // Cognito에서 FName
        phone: attributes.phone_number,  // Cognito에서 Phone Number
      };
    });
  } catch (error) {
    console.error('Error fetching users from Cognito:', error);
    return [];
  }
};

const SearchHandler = (app, db) => {
  app.post("/home/search", async (req, res) => {
    const blood = req.body.blood;
    const place = req.body.place;

    // IDC DB에서 Place와 Blood Group 가져오기
    const sqlSelect = "SELECT * FROM user_details WHERE userBloodGroup = ? OR userPlace = ?";
    db.query(sqlSelect, [blood, place], async (err, result) => {
      if (err) {
        console.log("**   SEARCH ERROR   **" + err);
        return res.status(500).send('Error searching data');
      }

      if (result.length > 0) {
        // Cognito에서 사용자 정보 가져오기
        const cognitoUsers = await getCognitoUsers();

        // IDC DB 결과와 Cognito 결과를 합치기
        const combinedResults = result.map(user => {
          const cognitoUser = cognitoUsers.find(cUser => cUser.userName === user.userUserName);
          return {
            userFName: cognitoUser ? cognitoUser.fullName : "N/A",
            userPhone: cognitoUser ? cognitoUser.phone : "N/A",
            userPlace: user.userPlace,
            userBloodGroup: user.userBloodGroup,
          };
        });

        res.send(combinedResults);
      } else {
        res.send({ message: "NO SEARCH RESULTS FOUND!" });
      }
    });
  });
};

export default SearchHandler;
