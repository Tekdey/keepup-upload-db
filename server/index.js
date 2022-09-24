require("dotenv").config();
const Activity = require("./src/schema/Activity");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// db connection
const MongooseConfig = require("./src/config/MongooseConfig");
const mongoose = new MongooseConfig();
mongoose.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.post("/post", async (req, res) => {
  const body = req.body;

  try {
    await Activity.create(body);

    const activities = await Activity.find(
      {},
      { category: 1, sport: 1, icon: 1, _id: 0 }
    );

    res.send(activities);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log("http://localhost:" + PORT));
