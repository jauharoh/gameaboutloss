(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./character', './timer', './data/patterns'], function(Character, Timer, patternData) {
    var Companion;
    Companion = (function() {
      __extends(Companion, Character);
      Companion.prototype.name = 'companion';
      Companion.prototype.scale = 0.7;
      Companion.prototype.radian = Math.PI * 1.8;
      Companion.prototype.singing = false;
      Companion.prototype.satisfaction = 0;
      Companion.prototype.currentPattern = 0;
      Companion.prototype.goal = 15;
      Companion.prototype.goalIncrement = 20;
      function Companion(name, director, other) {
        this.react = __bind(this.react, this);
        this.hearNote = __bind(this.hearNote, this);
        this.newPattern = __bind(this.newPattern, this);
        this.update = __bind(this.update, this);
        this.sing = __bind(this.sing, this);
        this.initialize = __bind(this.initialize, this);        this.pattern = patternData[0];
        Companion.__super__.constructor.call(this, name, director, other);
      }
      Companion.prototype.initialize = function() {
        this.enterState('revolving');
        return setTimeout(__bind(function() {
          return this.enterState('singing');
        }, this), 2000);
      };
      Companion.prototype.sing = function() {
        return this.enterState('singing');
      };
      Companion.prototype.update = function() {
        return Companion.__super__.update.call(this);
      };
      Companion.prototype.newPattern = function() {
        console.log('new pattern');
        this.currentPattern += 1;
        this.pattern = patternData[this.currentPattern];
        return this.goal += this.goalIncrement;
      };
      Companion.prototype.hearNote = function() {
        return this.currentState.hearNote() != null;
      };
      Companion.prototype.react = function() {
        if (this.reactionTimer.getTime() > 1000) {
          this.release();
          return this.reactionTimer = new Timer(this.director);
        }
      };
      return Companion;
    })();
    return Companion;
  });
}).call(this);
