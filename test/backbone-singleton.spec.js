// Underscore mocks
var _ = {
    each: function(obj, iterator, context) {
        if (obj == null) return obj;
        obj.forEach(iterator, context);
        return obj;
    },

    has: function(obj, key) {
        return hasOwnProperty.call(obj, key);
    },

    extend: function(obj) {
        _.each(Array.prototype.slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    }
};



// Backbone mocks
var Backbone = {
    Model: function (data, options) {
        this.data = data || {};
        this.options = options || {};

        this.get = function (key) {
            return this.data[key];
        };

        this.initialize.apply(this, arguments);
    }
};

_.extend(Backbone.Model.prototype, {
    initialize: function () {}
});

Backbone.Model.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function(){ return parent.apply(this, arguments); };
    }

    _.extend(child, parent, staticProps);

    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    if (protoProps) _.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;

    return child;
};



// Tests
describe('Backbone singleton', function() {

    it('should create a lazily-instantiated singleton from a Backbone class', function() {
        var spy = {
            initialize: function (options, data) {}
        };

        spyOn(spy, 'initialize');

        var MySingleton = BackboneSingleton(Backbone.Model.extend(spy));

        expect(spy.initialize.calls.count()).toEqual(0);

        var S1 = new MySingleton();

        expect(spy.initialize.calls.count()).toEqual(1);

        var S2 = new MySingleton();

        expect(spy.initialize.calls.count()).toEqual(1);

        expect(typeof MySingleton).toBe('function');
        expect(typeof S1).toBe('object');
        expect(S1).toEqual(S2);
    });

    it('should create a lazily-instantiated singleton with preset arguments', function() {
        var spy = {
            initialize: function (options, data) {}
        };

        spyOn(spy, 'initialize');

        var MySingleton = BackboneSingleton(Backbone.Model.extend(spy), {
            arguments: [
                {
                    foo: 'bar'
                }, {
                    flip: 'flop'
                }
            ]
        });

        var S1 = new MySingleton();

        expect(S1.get('foo')).toBe('bar');
        expect(S1.options.flip).toBe('flop');
    });

    it('should correctly maintain scope within the singleton', function() {
        var MySingleton = BackboneSingleton(Backbone.Model.extend({
            foo: 'bar',
            getFoo: function () {
                return this.foo;
            }
        }));

        var S = new MySingleton({
            flip: 'flop'
        });

        expect(S.foo).toBe('bar');
        expect(S.getFoo()).toBe('bar');
        expect(S.get('flip')).toBe('flop');
    });

    it('should pass through arguments on initial instantiation', function() {
        var MySingleton = BackboneSingleton(Backbone.Model.extend());

        var S = new MySingleton({
            foo: 'bar'
        }, {
            flip: 'flop'
        });

        expect(S.options.flip).toBe('flop');
        expect(S.get('foo')).toBe('bar');
    });

    it('should throw an error when attempting to pass in arguments to an already instantiated singleton', function() {
        var MySingleton = BackboneSingleton(Backbone.Model.extend());

        new MySingleton();

        expect(function() {
            new MySingleton(true);
        }).toThrow();
    });

    it('should create an immediately-instantiated singleton from a Backbone class', function() {
        var spy = {
            initialize: function (options, data) {}
        };

        spyOn(spy, 'initialize');

        var MySingleton = BackboneSingleton(Backbone.Model.extend(spy), {
            instantiate: true
        });

        expect(spy.initialize.calls.count()).toEqual(1);

        var S1 = new MySingleton();
        var S2 = new MySingleton();

        expect(spy.initialize.calls.count()).toEqual(1);

        expect(typeof MySingleton).toBe('function');
        expect(S1).toEqual(S2);
    });

    it('should create an immediately-instantiated singleton with preset arguments', function() {
        var spy = {
            initialize: function (options, data) {}
        };

        spyOn(spy, 'initialize');

        var MySingleton = BackboneSingleton(Backbone.Model.extend(spy), {
            instantiate: true,
            arguments: [
                {
                    foo: 'bar'
                }, {
                    flip: 'flop'
                }
            ]
        });

        expect(spy.initialize).toHaveBeenCalledWith(
            {
                foo: 'bar'
            }, {
                flip: 'flop'
            }
        );

        var S1 = new MySingleton();

        expect(typeof MySingleton).toBe('function');
        expect(S1.get('foo')).toBe('bar');
    });

});