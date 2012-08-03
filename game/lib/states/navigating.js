(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(['state'], function(State) {
    var Navigating;
    Navigating = (function() {
      __extends(Navigating, State);
      function Navigating() {
        Navigating.__super__.constructor.apply(this, arguments);
      }
      return Navigating;
    })();
    ({
      constructor: function(owner) {
        this.owner = owner;
      },
      update: __bind(function() {
        update.__super__.constructor.call(this);
        this.owner.setVector(this.owner.target[0], this.owner.target[1]);
        if (this.owner.isNearWaypoint()) {
          setTimeout(__bind(function() {
            return this.owner.emitAura();
          }, this), 100);
          this.enter(IdleState);
        }
        return this.owner.addForce(this.owner.maxForce);
      }, this)
    });
    return Navigating;
  });
}).call(this);
