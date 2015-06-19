<h1 align="center">BackboneSingleton</h1>

# About BackboneSingleton

This module allows for the creation of Backbone classes as singletons. Traditional approaches would have you either return the class already instantiated, or for lazy instantiation, wrapped in a function which then requires you to call `MySingleton.getInstance()`. I don't like this, I want to have my cake and eat it!

With this approach, you can define a singleton as lazily-instantiated, or immediately instantiated and instantiate it in the same way as you would with regular Backbone classes (e.g. `new MySingleton()`) but always get the same instance back.

# API

## BackboneSingleton(BackboneClass [, options])
Create a singleton from a Backbone class. Defaults to creating a lazily-instantiated singleton (instantiated when first referenced).

### BackboneClass {function}
This can be any Backbone class, e.g. a Model, a View. Anything that can be Backbone.extend(ed). 

### options {object}
Configuration options for the singleton.

#### options.instantiate {boolean}
To immediately instantiate the singleton rather than waiting for it to be referenced.

#### options.arguments {[*]}
An array of arguments to be passed in if instantiation is to occur immediately.


# Examples

## Lazily Instantiated Singleton
Create a lazily instantiated singleton (default):
```
var MySingletonModel = BackboneSingleton(Backbone.Model.extend({
    myFunc: function () {
        // do something...
    },
    foo: 'bar'
}));
```

Instantiate the singleton (this only *actually* instantiates the singleton the first time):
```
var m1 = new MySingletonModel({
    someModelData: 'foo'
});
```

You don't have to call new, but it doesn't hurt. The same code can be written as:
```
var m1 = MySingletonModel({
    someModelData: 'foo'
});
```

Future instantiations will simply return the previously instantiated instance:
```
var m2 = new MySingletonModel();  // === m1
```

## Immediately Instantiated Singleton
Create an immediately instantiated singleton:
```
var MySingletonModel = BackboneSingleton(Backbone.Model.extend({
    foo: 'bar'
}), {
    instantiate: true,
    arguments: [
        {
            someModelData: 'foo'
        }
    ]
});
```

Future instantiations simply refer to the already instantiated singleton.
```
var m1 = new MySingletonModel();  // Singleton has already been instantiated, so m1 is just a reference to it.
var m2 = new MySingletonModel();  // === m1
```

## Notes

### Referring with arguments
When you instantiate the singleton, it's possible to pass in arguments that you wish the instance to be created with.
If the instance has already been created however, passing in arguments is irrelevant and they will be lost.
This may create unexpected behaviour, leaving you wondering what happened to the arguments passed in.
As a means to avoiding this potential pitfall, I took the decision to throw an error if this happens. I may later
change this to simply logging a warning, or even look into how those arguments could be populated into the existing
instance. But for now, an error is thrown.

### Use of the 'new' keyword
It's up to you which method you prefer, but it makes no difference whether you do or don't use the new keyword. I would
suggest picking one and sticking with it. The reason it's there is to allow for the seamless transition between
instantiating a standard Backbone class, and instantiating a Backbone singleton.