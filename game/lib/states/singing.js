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
    var Singing;
    Singing = (function() {
      __extends(Singing, State);
      function Singing(owner) {
        this.owner = owner;
        this.checkTimer = __bind(this.checkTimer, this);
        this.update = __bind(this.update, this);
        this.start = __bind(this.start, this);
        Singing.__super__.constructor.call(this, this.owner);
        this.timer = new Timer(this.owner.director);
        this.currentIndex = 0;
        this.start(this.owner.pattern);
      }
      Singing.prototype.start = function(pattern) {
        this.timer.reset();
        this.owner.push();
        return this.pattern = pattern;
      };
      Singing.prototype.update = function() {
        Singing.__super__.update.call(this);
        return this.checkTimer();
      };
      Singing.prototype.checkTimer = function() {
        var diff;
        diff = this.pattern[this.currentIndex] - this.timer.getTime();
        if (diff <= 0) {
          this.timer.reset(diff);
          this.owner.push();
          this.owner.emitAura();
          if (this.currentIndex >= this.pattern.length - 1) {
            return this.owner.enterState('listening', {
              pattern: this.pattern
            });
          } else {
            return this.currentIndex += 1;
          }
        }
      };
      return Singing;
    })();
    return Singing;
  });
}).call(this);
