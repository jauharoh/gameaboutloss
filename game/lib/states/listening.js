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
    var Listening;
    Listening = (function() {
      __extends(Listening, State);
      function Listening(owner, options) {
        this.owner = owner;
        this.isBad = __bind(this.isBad, this);
        this.isGood = __bind(this.isGood, this);
        this.checkNote = __bind(this.checkNote, this);
        this.update = __bind(this.update, this);
        this.hearNote = __bind(this.hearNote, this);
        this.bakePattern = __bind(this.bakePattern, this);
        Listening.__super__.constructor.call(this, this.owner);
        this.bakePattern(options.pattern);
        this.noteIndex = 0;
        this.notes = [];
        this.lastNote = 0;
        this.goodNotes = 0;
        this.listening = true;
      }
      Listening.prototype.bakePattern = function(pattern) {
        var last, timing, _i, _len, _results;
        this.pattern = [];
        _results = [];
        for (_i = 0, _len = pattern.length; _i < _len; _i++) {
          timing = pattern[_i];
          if (_i > 0) {
            last = this.pattern[_i - 1];
          } else {
            last = 0;
          }
          _results.push(this.pattern.push(last + timing));
        }
        return _results;
      };
      Listening.prototype.hearNote = function() {
        this.notes.push(this.owner.director.time);
        if (this.notes.length > 1) {
          return this.checkNote();
        }
      };
      Listening.prototype.update = function() {
        return Listening.__super__.update.call(this);
      };
      Listening.prototype.checkNote = function() {
        var i;
        i = this.notes.length - 2;
        this.lastNote += this.notes[i + 1] - this.notes[i];
        if (Math.abs(this.lastNote - this.pattern[i]) < 250) {
          return this.isGood();
        } else {
          return this.isBad();
        }
      };
      Listening.prototype.isGood = function() {
        this.owner.messenger.broadcast(this.owner, {
          event: 'isGood'
        });
        this.goodNotes += 1;
        this.owner.satisfaction += 1;
        if (this.goodNotes >= this.pattern.length) {
          if (this.listening = true) {
            this.owner.satisfaction += 5;
            if (this.owner.satisfaction > this.owner.goal) {
              this.owner.newPattern();
            }
            setTimeout(__bind(function() {
              this.owner.release();
              return this.owner.emitAura();
            }, this), 500);
            setTimeout(__bind(function() {
              return this.owner.enterState('singing');
            }, this), 3000);
          }
          return this.listening = false;
        }
      };
      Listening.prototype.isBad = function() {
        if (this.listening) {
          this.owner.satisfaction -= 2;
          this.owner.reactNegative();
          setTimeout(__bind(function() {
            return this.owner.enterState('singing');
          }, this), 1000);
        }
        return this.listening = false;
      };
      return Listening;
    })();
    return Listening;
  });
}).call(this);
