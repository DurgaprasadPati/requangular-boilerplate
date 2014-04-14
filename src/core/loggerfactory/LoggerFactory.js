define(['moment', './supplant'], function(moment, supplant) {
   'use strict';

   var LogLevel = {
      ALL   : {value : Number.MAX_VALUE, label : 'TRACE'},
      TRACE : {value : 400000,           label : 'TRACE'},
      DEBUG : {value : 300000,           label : 'DEBUG'},
      INFO  : {value : 200000,           label : 'INFO '},
      WARN  : {value : 100000,           label : 'WARN '},
      ERROR : {value : Number.MIN_VALUE, label : 'ERROR'}
   };

   var logWriter = window.console.log, logWriterContext = window.console, logLevel = LogLevel.ERROR;

   /**
    * Partial application to pre-capture a logger function
    */
   function prepareLogFn (logWriter, className, level) {
      /**
       * Invoke the specified `logFn` with the supplant
       * functionality...
       */
      function enhancedLogFn () {
         var args = Array.prototype.slice.call(arguments);
         var now = moment().format('HH:mm:ss:SSS');

         var argsJoined = args.join('\n\t');

         // prepend a timestamp and optional classname to the original
         // output message
         var logArg = supplant('{0} [{1}] - [{2}] - {3}', [
            now, level.label, className, argsJoined
         ]);

         return level.value <= logLevel.value ? logWriter.call(logWriterContext, logArg) : undefined;
      }

      return enhancedLogFn;
   }

   /**
    * Support to generate class-specific logger instance with classname
    * only
    *
    * @param {String} module
    *
    * @returns Object wrapper facade to $log
    */
   function getInstance (module) {
      module = (module) ? module.replace(/\//g, '.') : '';

      return {
         trace : prepareLogFn(logWriter, module, LogLevel.TRACE),
         debug : prepareLogFn(logWriter, module, LogLevel.DEBUG),
         info  : prepareLogFn(logWriter, module, LogLevel.INFO),
         warn  : prepareLogFn(logWriter, module, LogLevel.WARN),
         error : prepareLogFn(logWriter, module, LogLevel.ERROR)
      };
   }

   function init (options) {
      if ('logWriter' in options) {
         logWriter = options.logWriter;
      }
      if ('logWriterContext' in options) {
         logWriterContext = options.logWriterContext;
      }
      if ('logLevel' in options) {
         var newLogLevel = LogLevel[options.logLevel];
         if (!newLogLevel) {
            throw new Error('Unknown logLevel: "' + options.logLevel + '"');
         }
         logLevel = newLogLevel;
      }
   }

   return {
      getInstance : getInstance,
      init : init
   };
});
