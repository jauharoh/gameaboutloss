(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./character', './states/revolving'], function(Character, Revolving) {
    var Player;
    Player = (function() {
      __extends(Player, Character);
      Player.prototype.maxForce = 1;
      Player.prototype.name = 'player';
      Player.prototype.scale = 0.3;
      Player.prototype.radian = Math.PI * 0.7;
      Player.prototype.events = {
        'mouseDown': 'mousePull',
        'mouseDrag': 'mousePull',
        'mouseUp': 'endPull',
        'touchStart': 'touchPull',
        'touchMove': 'touchPull',
        'touchEnd': 'endPull'
      };
      function Player(name, director) {
        this.mousePull = __bind(this.mousePull, this);
        this.touchPull = __bind(this.touchPull, this);
        this.release = __bind(this.release, this);
        this.isGood = __bind(this.isGood, this);
        this.update = __bind(this.update, this);
        this.initialize = __bind(this.initialize, this);        Player.__super__.constructor.call(this, name, director);
      }
      Player.prototype.initialize = function() {
        console.log('init');
        return this.enterState('revolving');
      };
      Player.prototype.update = function() {
        return Player.__super__.update.call(this);
      };
      Player.prototype.isGood = function() {
        return this.emitAura();
      };
      Player.prototype.release = function() {
        var range, time;
        Player.__super__.release.call(this);
        this.messenger.broadcast(this, {
          event: 'hearNote'
        });
        time = this.director.time;
        this.lastShout = time;
        return range = 200;
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
