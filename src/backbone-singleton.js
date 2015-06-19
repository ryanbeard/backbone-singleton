(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        root.BackboneSingleton = factory();
    }
}(this, function() {
    'use strict';


    return function (BackboneClass, options) {
        options || (options = {});

        // Helper to check for arguments. Throws an error if passed in.
        var checkArguments = function (args) {
            if (args.length) {
                throw new Error('cannot pass arguments into an already instantiated singleton');
            }
        };

        // Wrapper around the class. Allows us to call new without generating an error.
        var WrappedClass = function() {
            if (!BackboneClass.instance) {
                // Keep a reference to the arguments passed in to the singleton's instatiation.
                var args = arguments;

                // Proxy class that allows us to pass through all arguments on singleton instatiation.
                var F = function () {
                    return BackboneClass.apply(this, args);
                };

                // Extend the given Backbone class with a function that sets the instance for future use.
                BackboneClass = BackboneClass.extend({
                    __setInstance: function () {
                        BackboneClass.instance = this;
                    }
                });

                // Connect the proxy class to its counterpart class.
                F.prototype = BackboneClass.prototype;

                // Instantiate the proxy, then store the instance.
                (new F()).__setInstance();
            }
            else {
                // Make sure we're not trying to instantiate it with arguments again.
                checkArguments(arguments);
            }

            return BackboneClass.instance;
        };

        // Immediately instantiate the class.
        if (options.instantiate) {
            var instance = WrappedClass.apply(WrappedClass, options.arguments);

            // Return the instantiated class wrapped in a function so we can call it with new without generating an error.
            return function () {
                checkArguments(arguments);

                return instance;
            };
        }
        else {
            return WrappedClass;
        }
    };
}));