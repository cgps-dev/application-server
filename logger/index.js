const path = require("path");
const winston = require("winston");

require("winston-daily-rotate-file");

// const transport = new winston.transports.DailyRotateFile(
//   {
//     filename: `${process.env.LOGGER_APPLICATION ?? "cgps"}-%DATE%.log`,
//     datePattern: "YYYY-MM-DD-HH",
//     zippedArchive: true,
//     maxSize: process.env.LOGGER_MAX_SIZE ?? "64m",
//     maxFiles: process.env.LOGGER_MAX_FILES ?? "90d",
//   }
// );

// transport.on("rotate", function(oldFilename, newFilename) {
//   // do something fun
// });

// const noErrorFilter = winston.format(
//   (info, opts) => { 
// 	  return info.level !== "error" ? info : false;
//   }
// );

if (process.env.LOGGER_FILENAME) {
  const logger = winston.createLogger(
    {
      level: process.env.LOGGER_LEVEL ?? "info",
      // exitOnError: false,
      format: winston.format.combine(
        // winston.format.label({ label: path.basename(process.mainModule.filename) }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Format the metadata object
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
      ),
      transports: [
        new winston.transports.DailyRotateFile(
          {
            dirname: process.env.LOGGER_DIR ?? ".",
            handleExceptions: true,
            handleRejections: true,
            filename: `${process.env.LOGGER_FILENAME ?? "application"}-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: process.env.LOGGER_MAX_SIZE ?? "64m",
            maxFiles: process.env.LOGGER_MAX_FILES ?? "90d",
            format: winston.format.combine(
              // Render in one line in your log file.
              // If you use prettyPrint() here it will be really
              // difficult to exploit your logs files afterwards.
              winston.format.json(),
            )
          }
        ),
        // new winston.transports.DailyRotateFile(
        //   {
        //     filename: `${process.env.LOGGER_ACCESS_FILE ?? "access"}-%DATE%.log`,
        //     datePattern: "YYYY-MM-DD-HH",
        //     zippedArchive: true,
        //     maxSize: process.env.LOGGER_MAX_SIZE ?? "64m",
        //     maxFiles: process.env.LOGGER_MAX_FILES ?? "90d",
        //     format: winston.format.combine(
        //       noErrorFilter(),
        //       winston.format.timestamp(),
        //     )
        //   }
        // ),
      ],
    }
  );
  const info = logger.info;
  logger.info = function (message, metadata, context) {
    if (context?.user) {
      metadata.user = context.user.id || context.user.email || context.user.email;
    }
    if (context?.req) {
      metadata.userAgent = req.headers["user-agent"];
      metadata.remoteAddress = req.socket.remoteAddress;
    }
    info(
      message,
      metadata,
    );
  };
  module.exports = logger;
}
else {
  module.exports = winston.createLogger({ silent: true });
}
