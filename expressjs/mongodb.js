const mongoose = require("mongoose");

module.exports = function (options) {
  if (options.overwriteModels) {
    mongoose.set("overwriteModels", true);
  }

  return (req, res, next) => {
    // check if we have a connection to the database or if it's currently
    // connecting or disconnecting (readyState 1, 2 and 3)
    if (mongoose.connection.readyState >= 1) {
      next();
    }
    else {
      mongoose.connect(
        options.url,
        {
          // useFindAndModify: false,
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      )
        .then(() => next())
        .catch(next);
  
      // const db = mongoose.connection;
      // db.on("error", (error) => {
      //   console.error(error);
      //   // callback(error);
      // });
      // db.once("open", () => {
      //   callback(null, app);
      // });
    }
  };;
};
