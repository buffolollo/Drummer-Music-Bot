const mongoose = require("mongoose");
console.log(color.yellow("Trying to connect to database..."));
mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(color.bgGreen.white.bold("Connected to database"));
  })
  .catch((err) => {
    console.log(err);
  });
