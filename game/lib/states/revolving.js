(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['../state'], function(State) {
    var Revolving;
    Revolving = (function() {
      __extends(Revolving, State);
      function Revolving(owner) {
        this.owner = owner;
        this.update = __bind(this.update, this);
      }
      Revolving.prototype.update = function() {
        return this.owner.updateRadialPosition();
      };
      return Revolving;
    })();
    return Revolving;
  });
}).call(this);
