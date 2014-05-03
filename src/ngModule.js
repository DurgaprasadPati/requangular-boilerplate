define([
   'src/core/loggerfactory/module',
   'src/core/config/module',
   'angular',
   'angular-ui-router'
], function(LoggerFactory, Config, angular){
   'use strict';

   var ngModule = angular.module('ngModule', ['ng', 'ui.router']);

   LoggerFactory.setLogLevel(Config.getConfig('Core.LogLevel') || 'TRACE');

   var logger = LoggerFactory.getInstance('$log');
   ngModule.value('$log', logger);

   return ngModule;
});