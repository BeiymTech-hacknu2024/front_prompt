const app = require("./src/app");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
