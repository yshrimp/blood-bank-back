import AWS from 'aws-sdk';  // ESM 방식으로 aws-sdk import

const lambda = new AWS.Lambda({
    region: 'ap-northeast-2',  // 리전을 Lambda와 일치시킵니다.
});

const invokeLambda = async () => {
    const params = {
        FunctionName: 'GetUserdata',  // Lambda 함수 이름
        InvocationType: 'RequestResponse',
    };

    try {
        const result = await lambda.invoke(params).promise();
        // Lambda 응답을 두 번 파싱 (result.Payload가 JSON 문자열로 반환됨)
        const users = JSON.parse(result.Payload).body ? JSON.parse(JSON.parse(result.Payload).body) : [];
        console.log('Cognito Users:', users);
        return users;
    } catch (error) {
        console.error('Error invoking Lambda:', error);
        throw error;
    }
};


// 검색 요청 처리 핸들러
const SearchHandler = (app, db) => {
  app.post("/home/search", async (req, res) => {
    const blood = req.body.blood;
    const place = req.body.place;

    const sqlSelect = "SELECT * FROM user_details WHERE userBloodGroup = ? OR userPlace = ?";
    db.query(sqlSelect, [blood, place], async (err, result) => {
      if (err) {
        console.log("**   SEARCH ERROR   **", err);
        return res.status(500).send('Error searching data');
      }

      if (result.length > 0) {
        try {
          // Lambda 호출
          const cognitoUsers = await invokeLambda();

          const combinedResults = result.map(user => {
            const cognitoUser = cognitoUsers.find(cUser => cUser.sub === user.cognito_sub);

            console.log('DB User Cognito Sub:', user.cognito_sub);
            console.log('Cognito User:', cognitoUser);

            return {
              userFName: cognitoUser ? cognitoUser.fullName : "N/A",
              userPhone: cognitoUser ? cognitoUser.phone : "N/A",
              userPlace: user.userPlace,
              userBloodGroup: user.userBloodGroup,
            };
          });

          res.send(combinedResults);
        } catch (error) {
          console.error('Error merging data:', error);
          res.status(500).send('Error merging data');
        }
      } else {
        res.send({ message: "NO SEARCH RESULTS FOUND!" });
      }
    });
  });
};

export default SearchHandler;


