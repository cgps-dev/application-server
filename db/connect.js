const mongoose = require('mongoose');

module.exports = async function connect(options) {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (options.overwriteModels) {
    mongoose.set("overwriteModels", true);
  }

  return(
    mongoose.connect(
      options.url,
      {
        // useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )
  );
};
