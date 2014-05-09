define([
   'module',
   'src/cmn/core/loggerfactory/module',
   'src/cmn/core/config/module',
   'src/cmn/core/entityregistry/module',
   'src/ngModule',
   'lodash'
], function(module, LoggerFactory, Config, EntityRegistry, ngModule, _) {
   'use strict';

   return {
      register : function(moduleName, serviceArray) {
         if (!(serviceArray instanceof Array)) {
            throw new Error('Service function must be provided in array form');
         }

         var serviceLogger = LoggerFactory.getInstance(moduleName);
         var serviceName = _.last(moduleName.split('\/'));
         serviceLogger.trace('Register start');

         var serviceFn = serviceArray.pop();

         ngModule.service(serviceName, serviceArray.concat(function() {
            this.logger = serviceLogger;
            this._ = _;
            this.Config = Config;
            this.EntityRegistry = EntityRegistry;
            serviceFn.apply(this, arguments);
         }));
         serviceLogger.trace('Register end');
      }
   };
});