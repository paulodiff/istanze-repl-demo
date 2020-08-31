/** loggerModuleWinstonSingleton.js - 
 * Modulo per la gestione dei log.
 * Genera alcuni log, su file, su console e cifrato
 */

var winston = require('winston');
require('winston-daily-rotate-file');
// require('winston-logrotate');
require('winston-mail');

const { combine, timestamp, printf, label } = winston.format;
const { createLogger, format, transports } = require('winston');

const moment = require('moment-timezone');
const path = require('path');
var crypto = require('crypto');

var loggers = [];

/**
 * @class Logger
 *
 */
class Logger {

    /**
     * Create a logger.
     * @param {Object} opt - configurazione della classe.
     */
    constructor(opt) {
/*
        var log = lmw.buildRotateFileLogger(ENV.logWinstonConfig.logPath,ENV.logWinstonConfig.logName);
        var logVerbose = lmw.buildRotateFileLogger(ENV.logWinstonConfig.logPath,ENV.logWinstonConfig.logName +'-verbose');
        var logConsole = lmw.buildConsoleLogger();
        var logMail = lmw.buildMailLogger({
            to: 'ruggero.ruggeri@comune.rimini.it',
            from: 'istanze.errori@comune.rimini.it',
            subject : '[ERRORE ISTANZA]',
            host: 'srv-mail.comune.rimini.it',
            port: 25});
*/
        console.log('@@@@...loggerModuleWinstonSingleton...constructor ....', opt);

        // check options

        if(!opt){
            console.log('loggerModuleWinstonSingleton opt error!');
            process.exit(0);
        }

        if(      
            (!opt.hasOwnProperty("logPath")) ||
            (!opt.hasOwnProperty("logName")) ||
            (!opt.hasOwnProperty("to")) ||
            (!opt.hasOwnProperty("from")) ||
            (!opt.hasOwnProperty("host")) ||
            (!opt.hasOwnProperty("port")) ||
            (!opt.hasOwnProperty("toConsole")) ||
            (!opt.hasOwnProperty("encryptVerbose")) ||
            (!opt.hasOwnProperty("secret"))
            )
            {
                console.log('##LOG ERROR############################');
                console.log('loggerModuleWinstonSingleton opt error!');
                console.log(opt);
                process.exit(0);
            }


        this.options = opt;
        this.logFile = this.buildRotateFileLogger(opt.logPath,opt.logName);
        this.logConsole1 = this.buildConsoleLogger();
        this.logFile1 = this.buildRotateFileLoggerEncrypted(opt.logPath,opt.logName);
        // this.logConsole1 = this.buildConsoleLogger();
        this.logVerbose = this.logVerbose;
        this.decryptLogLine = this.decryptLogLine;
        // this.logFileDemo = this.buildFileLogger(opt.logPath,opt.logName);
        
        
        // this.buildRotateFileLoggerAndConsole(opt.logPath,opt.logName);
        // this.logVerbose = this.buildRotateFileLogger(opt.logPath,opt.logName +'-verbose');
        // this.logVerbose = this.buildConsoleLogger();
        this.logMail = this.buildMailLogger({
            to: opt.to,
            from: opt.from,
            subject : opt.subject,
            host: opt.host,
            port: opt.port});
    }

    get count() {
        return 0;
    }

    log(message) {
        const timestamp = moment().tz("Europe/Rome").toISOString(true);
        this.logs.push({ message, timestamp });
        console.log(`${timestamp} - ${message}`);
    }
   /**
     * Convert a string containing two comma-separated numbers into a point.
     * @param {string} action - The string containing two comma-separated numbers.
     * @param {string} msg - The string containing two comma-separated numbers.
     * @return {} null.
     */
    logVerbose (action, msg) {

    // console.log('logVerbose', action, msg);

    if(!msg) {
        msg = 'logger-dummy-msg-not-defined!';
    }

    if(!action) {
        action = 'logger-dummy-action-not-defined!';
    }

    if(this.options.toConsole) {
        this.logConsole1.info(action, msg);
    }

    this.logFile1.info(action, msg);
    

}

printWinstonExtraInfo (info) {
    const skpippedProperties = ['message', 'timestamp', 'level'];
    let response = '';
    let responseObj = {};

    // console.log(typeof(info));
    // console.log(info);
  
    if (info[Symbol.for('splat')]) {
        // console.log(typeof(info[Symbol.for('splat')]));
        if(info[Symbol.for('splat')][0]){
            // console.log('TYPE:', typeof(info[Symbol.for('splat')][0]));  
            if( typeof(info[Symbol.for('splat')][0]) === 'object') {
                
                
                for (let key in info) {
                  // console.log(key);
                  let value = info[key];
                  if (skpippedProperties.includes(key)) { continue };
                  if (value === undefined || value === null) { continue };
                  response += `${key}=${value} `;
                  responseObj[key] = value;
                }
              
                // console.log('RETO:', JSON.stringify(responseObj));
                return JSON.stringify(responseObj);

            }   

            if( typeof(info[Symbol.for('splat')][0]) === 'string') {

                // console.log('RETS:', info[Symbol.for('splat')][0]);
                return info[Symbol.for('splat')][0];

            }   

            if( typeof(info[Symbol.for('splat')][0]) === 'number') {

              // console.log('RETS:', info[Symbol.for('splat')][0]);
              return JSON.stringify(info[Symbol.for('splat')][0]);

          }

            // console.log('RETN:', '-null-');
            return '';

        }    
    } else {

        // console.log('RETV:', '-null-');
        return '';


    }   
    
    // console.log(typeof(info[Symbol.for('splat')]));
    // console.log(typeof(info[Symbol.for('splat')][0]));
    // console.log(info[Symbol.for('splat')][0]);

    
}

/*
 * Simple helper for stringifying all remaining
 * properties.
 */
 rest(info) {
    return JSON.stringify(Object.assign({}, info, {
      level: undefined,
      message: undefined,
      splat: undefined,
      label: undefined
    }));
}


buildFileLogger(logFilepath, prefixFileName) {
    
  return winston.createLogger({ 
    format: winston.format.combine(
        // winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        
        winston.format.timestamp({
            format: function() {
              return moment().tz("Europe/Rome").toISOString(true);
            }
          }),
          
        winston.format.printf(info => {
            // console.log(info);
            return `${info.timestamp} ${info.level} ${info.message} ${this.printWinstonExtraInfo(info)}`;
          })
      ),
    transports: [

      new winston.transports.File({
        tailable : true,
        // datePattern: 'YYYY-MM-DD',
        filename: path.join( logFilepath, prefixFileName + 'QQ.log'),
        maxsize : 1000,
        maxFiles : 1000

      })
     

    ] 
});

}


buildRotateFileLogger(logFilepath, prefixFileName) {
    
    return winston.createLogger({ 

      format: winston.format.combine(
    
          winston.format.timestamp({
              format: function() {
                return moment().tz("Europe/Rome").toISOString(true);
              }
            }),
            
          winston.format.printf(info => {
              // console.log(info);
              return `${info.timestamp} ${info.level} ${info.message} ${this.printWinstonExtraInfo(info)}`;
            })

        ),

      transports: [
      new winston.transports.DailyRotateFile({
          name: 'file',
          datePattern: 'YYYY-MM-DD',
          // createSymlink: true,
          // symlinkName: 'ISTANZE-CURRENT.log',
          filename: path.join( logFilepath, prefixFileName + '-%DATE%.log')
        })
      ] 
  });
  
}

buildRotateFileLoggerAndConsole(logFilepath, prefixFileName) {
    
    return winston.createLogger({ 
      format: winston.format.combine(
          // winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
          
          winston.format.timestamp({
              format: function() {
                return moment().tz("Europe/Rome").toISOString(true);
              }
            }),
            
          winston.format.printf(info => {
              // console.log(info);
              return `${info.timestamp} ${info.level} ${JSON.stringify(info.message)} ${this.printWinstonExtraInfo(info)}`;
            })
        ),
      transports: [
      new winston.transports.DailyRotateFile({
          name: 'file',
          datePattern: 'YYYY-MM-DD',
          filename: path.join( logFilepath, prefixFileName + '-%DATE%-v.log')
        }),
        new winston.transports.Console({ })
      ] 
  });
  
}

buildRotateFileLoggerEncrypted(logFilepath, prefixFileName) {
    
    return winston.createLogger({ 
      format: winston.format.combine(
          // winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
          
          winston.format.timestamp({
              format: function() {
                return moment().tz("Europe/Rome").toISOString(true);
              }
            }),
            
          winston.format.printf(info => {
              // console.log(info);
              let s1 = info.message;
              let s2 = this.printWinstonExtraInfo(info);

              if(this.options.encryptVerbose) {
                s1 = JSON.stringify(s1);
                s2 = JSON.stringify(s2);
                s1 = this.encryptString64(s1, this.options.secret);
                s2 = this.encryptString64(s2, this.options.secret);
              }

              // console.log(this.decryptString64(s1,this.options.secret));
              // console.log(this.decryptString64(s2,this.options.secret));
              return `${info.timestamp} ${info.level} ${s1} ${s2}`;
            })
        ),
      transports: [
      new winston.transports.DailyRotateFile({
          name: 'file',
          datePattern: 'YYYY-MM-DD',
          filename: path.join( logFilepath, prefixFileName + '-%DATE%-verbose.enc')
        })
      ] 
  });
  
}

buildMailLogger(options) {
    
    return winston.createLogger({ 

        transports: [
            new winston.transports.Mail({
                to: options.to,
                from: options.from,
                subject : options.subject,
                host: options.host,
                port: options.port
            })
        ]
  });
  
}

buildConsoleLogger() {
    return winston.createLogger({ 
      
        format: winston.format.combine(
            winston.format.timestamp({
                format: function () {
                  return moment().tz("Europe/Rome").toISOString(true);
                }
              }),
            // winston.format.splat(),
            winston.format.printf(info => {
                // console.log(typeof(info[Symbol.for('splat')]));
                // console.log(typeof(info[Symbol.for('splat')][0]));
                // console.log(info[Symbol.for('splat')][0]);
                return `${info.timestamp} ${info.level} ${info.message} ${this.printWinstonExtraInfo(info)}`;
                //return `[${info.timestamp}] [${info.level}] : ${JSON.stringify(info.message)} : ${rest(info)}`;
              })
        ),

        
        transports: [  new winston.transports.Console({
            // timestamp: tsFormat
            /*,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.label({ label: '[my-label]' }),
              winston.format.colorize(),
              winston.format.simple()
            )
            */
          })
        ] 
    });        
}

encryptString64(source, password) {
    const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
    const algorithm = 'aes-256-ctr';
    // console.log('encryptString from:', source);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const bSource = Buffer.from(source);
    const result = Buffer.concat([iv, cipher.update(bSource), cipher.final()]);
    return result.toString('base64');
  }
  
  decryptString64(source, password) {
    const algorithm = 'aes-256-ctr';
    const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
    // console.log('decryptString64 from:', source);
    let encrypted = Buffer.from(source, 'base64');
    // Get the iv: the first 16 bytes
    const iv = encrypted.slice(0, 16);
    // Get the rest
    encrypted = encrypted.slice(16);
    // Create a decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    // Actually decrypt it
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  
    return result.toString();
  }

  decryptLogLine(line) {
    // const l = '[ENC2020-04-09 10:27:35 760] [info] : nyv0whHfUA38AJmYlK2WCmvlYOl0Jj/tm7zp : KmYZWz/z/EkwTO0KJZviVLs6D1Lxo76j3qjQ9bdfclsIwxr6mOOi3f2c9XWg';
    let l = line;
    let items = l.split(" ");
    // console.log(items, items.length);
    var n = items.length;
    var s1 = items[2];
    var s2 = items[3];
    // console.log(s1, s2);
    items[2] = this.decryptString64(s1, this.options.secret);
    items[3] = this.decryptString64(s2, this.options.secret);
    return items.join(' ');
  }

}

/**
 * @class Singleton
 *
 */
class Singleton {

    constructor(opt) {
        if (!Singleton.instance) {
            Singleton.instance = new Logger(opt);
        }
    }
  
    getInstance() {
        return Singleton.instance;
    }
  
  }
  
module.exports = Singleton;