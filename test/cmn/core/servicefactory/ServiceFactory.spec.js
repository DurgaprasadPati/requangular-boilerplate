define([
   'module',
   'angular-mocks',
   'src/cmn/core/servicefactory/ServiceFactory'
], function(module, angular, ServiceFactory) {
   'use strict';
   /*global describe : false, beforeEach : false, inject : false, it : false, expect : false*/

   describe(module.id, function() {

      var testService = function() {
         this.testMethod = function() {
            return 'test';
         };
      };

      function registerTestService (service) {
         ServiceFactory.register('test_service', service);
      }

      it('should register angular services', function() {
         registerTestService([testService]);
         var $injector =  angular.injector(['ngModule']);
         var service = $injector.get('test_service');

         expect(service).toBeDefined();
         expect(typeof service.testMethod).toEqual('function');
         expect(service.testMethod()).toEqual('test');
      });

      it('should inject logger into services', function() {
         registerTestService([testService]);
         var $injector =  angular.injector(['ngModule']);
         var service = $injector.get('test_service');

         expect(service.logger).toBeDefined();
      });

      it('should fail, when service is not in array format', function() {
         function f () {
            registerTestService(testService);
         }
         expect(f).toThrow();
      });

      it('should inject lodash into services', function() {
         registerTestService([testService]);
         var $injector =  angular.injector(['ngModule']);
         var service = $injector.get('test_service');

         expect(service._).toBeDefined();
      });
   });
});