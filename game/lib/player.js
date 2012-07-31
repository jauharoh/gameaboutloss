(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./character'], function(Character) {
    var Player;
    Player = (function() {
      __extends(Player, Character);
      Player.prototype.maxForce = 1;
      Player.prototype.name = 'player';
      Player.prototype.events = {
        'mouseDown': 'mousePull',
        'mouseDrag': 'mousePull',
        'mouseUp': 'endPull',
        'touchStart': 'touchPull',
        'touchMove': 'touchPull',
        'touchEnd': 'endPull'
      };
      function Player(name, director, other) {
        this.mousePull = __bind(this.mousePull, this);
        this.touchPull = __bind(this.touchPull, this);
        this.release = __bind(this.release, this);
        this.update = __bind(this.update, this);        Player.__super__.constructor.call(this, name, director, other);
      }
      Player.prototype.update = function() {
        return Player.__super__.update.call(this);
      };
      Player.prototype.release = function() {
        var range, time;
        Player.__super__.release.call(this);
        time = this.director.time;
        this.lastShout = time;
        range = 200;
        if (this.other.lastShout + range > time) {
          this.other.happiness += 1;
          return this.other.emitAura();
        }
      };
      Player.prototype.touchPull = function(e) {
        var x, y;
        x = e.changedTouches[0].pageX + this.actor.x;
        y = e.changedTouches[0].pageY + this.actor.y;
        return this.startPull(x, y);
      };
      Player.prototype.mousePull = function(e) {
        var x, y;
        x = e.sourceEvent.pageX;
        y = e.sourceEvent.pageY;
        return this.startPull(x, y);
      };
      return Player;
    })();
    return Player;
  });
}).call(this);
