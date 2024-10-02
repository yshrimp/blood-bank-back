

import AWS from 'aws-sdk';  // EMS 방식으로 aws-sdk import

const cognitoISP = new AWS.CognitoIdentityServiceProvider();

const UserRegisterHandler = (app, idcDb) => {
  app.post("/reg/usr", (req, res) => {
    const { userPlace, userBloodGroup, cognitoSub } = req.body;

    // DB에 user_details 저장할 때 sub도 함께 저장
    const sql1 = `
      INSERT INTO user_details (userPlace, userBloodGroup, cognito_sub)
      VALUES (?, ?, ?)
    `;
    idcDb.query(sql1, [userPlace, userBloodGroup, cognitoSub], (err, result) => {
      if (err) {
        console.error('Error saving user details:', err);
        return res.status(500).send('Error saving user details');
      }

      res.status(200).send('User registration successful');
    });
  });
};

export default UserRegisterHandler;




