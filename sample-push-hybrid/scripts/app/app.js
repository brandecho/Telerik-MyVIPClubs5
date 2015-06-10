var app = (function (win) {
    'use strict';

    // Global error handling
    var showAlert = function(message) {
        alert(message);
    };

    var showError = function(message) {
        showAlert(message);
    };

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    // Initialize Backend Services SDK
    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });

    var emptyGuid = '00000000-0000-0000-0000-000000000000';

    var AppHelper = {

        // Return user profile picture url
        resolveProfilePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return 'styles/images/avatar.png';
            }
        },

        // Return current activity picture url
        resolvePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return '';
            }
        },

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {

            var months = [
                'Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ];
            var date = new Date(dateString);
            var year = date.getFullYear();
            var month = months[ date.getMonth() ];
            var day = date.getDate();

            return month + ' ' + day + ', ' + year;
        },

        // Current user logout
        logout: function () {
            if (analytics.isAnalytics()) {
                analytics.Stop();
            }
            return el.Users.logout();
        },

        reload: function () {
            if (!window.location.origin) {
              window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            }
            window.location.replace(window.location.origin);
        }
    };

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        layout: 'mobile-tabstrip',
        skin: 'flat'
    });

    var getYear = (function () {
        var currentTime = new Date();
        return currentTime.getFullYear();
    }());

    return {
        showAlert: showAlert,
        showError: showError,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        helper: AppHelper,
        everlive: el,
        getYear: getYear
    };

}(window));

(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
      models: {
        home: {
          title: 'Home'
        },
        settings: {
          title: 'Settings'
        },
        contacts: {
          title: 'Contacts',
          ds: new kendo.data.DataSource({
            data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }]
          }),
          alert: function(e) {
            alert(e.data.name);
          }
        }
      }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
      
      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
      navigator.splashscreen.hide();

      app = new kendo.mobile.Application(document.body, {
        
        // comment out the following line to get a UI which matches the look
        // and feel of the operating system
        skin: 'flat',

        // the application needs to know which view to load first
        initial: 'views/home.html'
      });

    }, false);


}());