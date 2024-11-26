const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("NeedToAddYourServerKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(bodyParser.json());

app.post("/sendNotification", (req, res) => {
  const { token, messageBody, title } = req.body;
  const message = {
    token: token,
    data: {
      description: messageBody,
      title: title,
    },
  };
  console.log(message);
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
      res.status(200).send({ success: true, response: response });
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).send({ success: false, error: error.message });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
