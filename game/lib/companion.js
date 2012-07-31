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
    var Companion;
    Companion = (function() {
      __extends(Companion, Character);
      Companion.prototype.name = 'companion';
      function Companion(name, director, other) {
        this.react = __bind(this.react, this);
        this.charge = __bind(this.charge, this);
        this.update = __bind(this.update, this);
        this.setTrack = __bind(this.setTrack, this);        Companion.__super__.constructor.call(this, name, director, other);
        this.beat = 60000 / 44;
        this.reactionTimer = new Timer(this.director);
        this.chargeTimer = new Timer(this.director);
        this.beatsTimer = new Timer(this.director);
        this.offset = 0;
        this.happiness = 0;
        this.singing = false;
      }
      Companion.prototype.setTrack = function(track, signature, offset) {
        this.beatsTimer.reset();
        this.beat = 60000 / (track.bpm / signature);
        return this.offset = offset;
      };
      Companion.prototype.update = function() {
        Companion.__super__.update.call(this);
        if (this.happiness > 3) {
          music.next(4);
          this.happiness = 0;
        }
        if (this.singing) {
          if (this.beatsTimer.getTime(this.offset) > this.beat) {
            this.charge();
            this.beatsTimer.reset();
          }
        }
        if (this.charging != null) {
          if (this.chargeTimer.getTime() > 1000) {
            this.release();
            if (this.other.lastShout > this.director.time - 100) {
              this.emitAura();
              this.happiness += 1;
            }
            this.lastShout = this.director.time;
            this.charging = null;
          }
        }
        this.pathToPlayer = new CAAT.LinearPath().setInitialPosition(this.actor.x, this.actor.y).setFinalPosition(this.other.actor.x, this.other.actor.y);
        if (this.pathToPlayer.updatePath().getLength() < 300) {
          return this.react();
        }
      };
      Companion.prototype.charge = function() {
        this.charging = true;
        this.chargeTimer.reset();
        return this.shrink();
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
