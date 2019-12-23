const express = require("express");
const app = express();
const connectDB = require("./config/db");

//connect DB
connectDB();
app.get("/", (req, res) => res.send("API Running"));

//init middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

//Define Routes

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/post", require("./routes/posts"));
app.use("/api/profile", require("./routes/profile"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server started on Port" + PORT));
