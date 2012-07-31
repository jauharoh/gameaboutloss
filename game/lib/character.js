(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./timer'], function() {
    var Character, IdleState, NavigateState, RevolveState, State, Waypoint;
    Character = (function() {
      Character.prototype.deviceScale = window.innerHeight / 768;
      Character.prototype.events = [];
      Character.prototype.mass = 100;
      Character.prototype.vel = 0;
      Character.prototype.accelerationTimer = null;
      Character.prototype.force = 0;
      Character.prototype.maxForce = 1;
      Character.prototype.friction = 0.1;
      Character.prototype.orientation = 0;
      Character.prototype.pulling = false;
      Character.prototype.normalizedVector = [0, 0];
      Character.prototype.localizedVector = [0, 0];
      Character.prototype.radian = 0;
      Character.prototype.radius = 300;
      Character.prototype.behaviors = {
        shrink: new CAAT.ScaleBehavior(),
        release: new CAAT.ScaleBehavior(),
        revert: new CAAT.ScaleBehavior(),
        alpha: new CAAT.AlphaBehavior()
      };
      Character.prototype.interps = {
        shrink: new CAAT.Interpolator().createExponentialOutInterpolator(4, false),
        move: new CAAT.Interpolator().createExponentialOutInterpolator(2, false),
        shrink: new CAAT.Interpolator().createExponentialOutInterpolator(4, false),
        release: new CAAT.Interpolator().createExponentialOutInterpolator(2, false),
        revert: new CAAT.Interpolator().createElasticOutInterpolator(1, 0.5)
      };
      function Character(name, director, other) {
        this.name = name;
        this.director = director;
        this.other = other;
        this.setCurrentState = __bind(this.setCurrentState, this);
        this.release = __bind(this.release, this);
        this.emitAura = __bind(this.emitAura, this);
        this.shrink = __bind(this.shrink, this);
        this.revert = __bind(this.revert, this);
        this.behave = __bind(this.behave, this);
        this.rest = __bind(this.rest, this);
        this.updatePosition = __bind(this.updatePosition, this);
        this.move = __bind(this.move, this);
        this.setLocation = __bind(this.setLocation, this);
        this.getDistanceToVector = __bind(this.getDistanceToVector, this);
        this.getActorCenter = __bind(this.getActorCenter, this);
        this.paint = __bind(this.paint, this);
        this.update = __bind(this.update, this);
        this.test = __bind(this.test, this);
        this.setWaypoint = __bind(this.setWaypoint, this);
        this.addWaypoint = __bind(this.addWaypoint, this);
        this.setDestination = __bind(this.setDestination, this);
        this.isNearWaypoint = __bind(this.isNearWaypoint, this);
        this.setVector = __bind(this.setVector, this);
        this.setOrientation = __bind(this.setOrientation, this);
        this.addForce = __bind(this.addForce, this);
        this.endPull = __bind(this.endPull, this);
        this.startPull = __bind(this.startPull, this);
        this.initEvents = __bind(this.initEvents, this);
        this.initialize = __bind(this.initialize, this);
        this.vel = {
          x: 0,
          y: 0
        };
        this.maxScale = 1.2 * this.deviceScale;
        this.minScale = 0.35 * this.deviceScale;
        this.baseScale = 1 * this.deviceScale;
        this.actor = new CAAT.Actor().setBackgroundImage(this.director.getImage(this.name));
        this.actor.setScale(this.baseScale, this.baseScale);
        this.actor.name = this.name;
        this.target = [this.actor.x, this.actor.y];
        this.accelerationTimer = new Timer(this.director);
        this.initialize();
        this.initEvents();
      }
      Character.prototype.initialize = function() {
        this.setCurrentState(RevolveState);
        return this.waypoints = [];
      };
      Character.prototype.initEvents = function() {
        var event, _results;
        if (this.events != null) {
          _results = [];
          for (event in this.events) {
            _results.push(this.actor[event] = this[this.events[event]]);
          }
          return _results;
        }
      };
      Character.prototype.startPull = function(x, y) {
        this.setVector(x, y);
        return this.pulling = true;
      };
      Character.prototype.endPull = function() {
        return this.pulling = false;
      };
      Character.prototype.addForce = function(force) {
        return this.force = force;
      };
      Character.prototype.setOrientation = function(orientation) {
        this.orientation = orientation;
        return this;
      };
      Character.prototype.setVector = function(x, y) {
        var m, nx, ny, tx, ty;
        this.target = [x, y];
        tx = (this.actor.x + this.actor.width / 2) - x;
        ty = (this.actor.y + this.actor.height / 2) - y;
        m = Math.sqrt(tx * tx + ty * ty);
        nx = tx / m;
        ny = ty / m;
        this.localizedVector = [tx, ty];
        this.normalizedVector = [nx, ny];
        return this;
      };
      Character.prototype.isNearWaypoint = function() {
        return this.getDistanceToVector(this.target) < 500;
      };
      Character.prototype.setDestination = function() {
        if (this.waypoints.length > 0) {
          return this.setWaypoint();
        }
      };
      Character.prototype.addWaypoint = function(x, y) {
        var waypoint;
        waypoint = new Waypoint(this.director, x, y);
        if (this.waypoints) {
          this.waypoints.push(waypoint);
        } else {
          this.waypoints = [waypoint];
        }
        return this;
      };
      Character.prototype.setWaypoint = function() {
        this.setVector(this.waypoints[0].x, this.waypoints[0].y);
        if (this.currentWaypoint) {
          this.currentWaypoint.waypoint.setExpired(0);
        }
        this.currentWaypoint = this.waypoints[0];
        return this.waypoints.splice(0, 1);
      };
      Character.prototype.test = function(x, y) {
        return this.testPoints = [x, y];
      };
      Character.prototype.update = function() {
        return this.currentState.update();
      };
      Character.prototype.paint = function() {};
      Character.prototype.getActorCenter = function() {
        return [this.actor.x + this.actor.width / 2, this.actor.y + this.actor.height / 2];
      };
      Character.prototype.getDistanceToVector = function(vector) {
        var tx, ty;
        tx = this.getActorCenter()[0] - vector[0];
        ty = this.getActorCenter()[1] - vector[1];
        return (tx * tx) + (ty * ty);
      };
      Character.prototype.setLocation = function(x, y) {
        this.actor.setLocation(x, y);
        return this.target = this.getActorCenter();
      };
      Character.prototype.move = function(e) {
        var x, y;
        x = this.actor.x;
        y = this.actor.y;
        this.vel.x = ((e.pageX - this.actor.width / 2) - x) / 30;
        this.vel.y = ((e.pageY - this.actor.height / 2) - y) / 30;
        this.actor.x = x + this.vel.x;
        return this.actor.y = y + this.vel.y;
      };
      Character.prototype.updatePosition = function() {
        this.vel.x -= this.normalizedVector[0] * this.force;
        this.vel.y -= this.normalizedVector[1] * this.force;
        this.vel.x *= 1 - this.friction;
        this.vel.y *= 1 - this.friction;
        this.actor.x += this.vel.x;
        return this.actor.y += this.vel.y;
      };
      Character.prototype.rest = function() {
        this.vel.x = this.vel.x - (this.vel.x / 30);
        this.vel.y = this.vel.y - (this.vel.y / 30);
        this.actor.x = this.actor.x + this.vel.x;
        return this.actor.y = this.actor.y + this.vel.y;
      };
      Character.prototype.behave = function(behavior, isolate) {
        if (isolate == null) {
          isolate = false;
        }
        if (!isolate) {
          this.actor.emptyBehaviorList();
        }
        return this.actor.addBehavior(behavior);
      };
      Character.prototype.revert = function() {
        var behavior;
        behavior = new CAAT.ScaleBehavior().setValues(this.maxScale, this.baseScale, this.maxScale, this.baseScale, 0.5, 0.5).setInterpolator(this.interps.revert).setFrameTime(this.director.time, 800);
        return this.actor.addBehavior(behavior);
      };
      Character.prototype.shrink = function() {
        var behavior;
        behavior = new CAAT.ScaleBehavior().setCycle(false).setValues(this.baseScale, this.minScale, this.baseScale, this.minScale, 0.5, 0.5).setInterpolator(this.interps.shrink).setFrameTime(this.director.time, 3000);
        return this.behave(behavior);
      };
      Character.prototype.emitAura = function() {
        var aura, bAlpha, bScale;
        director.getAudioManager().play('drum1');
        bScale = new CAAT.ScaleBehavior().setCycle(false).setValues(0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.5, 0.5).setInterpolator(this.interps.release).setFrameTime(this.director.time, 800);
        bAlpha = new CAAT.AlphaBehavior().setCycle(false).setValues(1, 0).setInterpolator(this.interps.release).setFrameTime(this.director.time, 800);
        aura = new CAAT.Actor().setBackgroundImage(this.director.getImage(this.name + '-aura')).centerAt(this.actor.x + this.actor.width / 2, this.actor.y + this.actor.height / 2).setFrameTime(this.director.time, 800).addBehavior(bAlpha).addBehavior(bScale);
        return this.director.scenes[0].activeChildren.addChild(aura);
      };
      Character.prototype.release = function() {
        var behavior;
        this.emitAura();
        this.director.getAudioManager().play('ding');
        behavior = new CAAT.ScaleBehavior().setCycle(false).setValues(0.85, this.maxScale, 0.85, this.maxScale, 0.5, 0.5).setInterpolator(this.interps.shrink).setFrameTime(this.director.time, 120).setValues(this.actor.scaleX, this.maxScale, this.actor.scaleY, this.maxScale, 0.5, 0.5).addListener({
          behaviorExpired: __bind(function(behavior, time, actor) {
            return this.revert();
          }, this)
        });
        return this.behave(behavior);
      };
      Character.prototype.setCurrentState = function(state) {
        return this.currentState = new state(this);
      };
      return Character;
    })();
    State = (function() {
      function State(owner) {
        this.owner = owner;
        this.enter = __bind(this.enter, this);
        this.update = __bind(this.update, this);
      }
      State.prototype.update = function() {
        return this.owner.updatePosition();
      };
      State.prototype.enter = function(state, setting) {
        if (setting == null) {
          setting = null;
        }
        return this.owner.setCurrentState(state);
      };
      return State;
    })();
    RevolveState = (function() {
      __extends(RevolveState, State);
      function RevolveState(owner) {
        this.owner = owner;
        this.update = __bind(this.update, this);
      }
      RevolveState.prototype.update = function() {
        this.owner.radian += .02;
        this.owner.actor.x = 200 + this.owner.radius * Math.cos(this.owner.radian);
        return this.owner.actor.y = 0 + this.owner.radius * Math.sin(this.owner.radian);
      };
      return RevolveState;
    })();
    IdleState = (function() {
      __extends(IdleState, State);
      function IdleState(owner) {
        this.owner = owner;
        this.update = __bind(this.update, this);
      }
      IdleState.prototype.update = function() {
        if (this.owner.force !== 0) {
          this.owner.addForce(0);
        }
        IdleState.__super__.update.call(this);
        if (this.owner.waypoints.length > 0) {
          this.owner.setDestination();
          return this.enter(NavigateState);
        }
      };
      return IdleState;
    })();
    NavigateState = (function() {
      __extends(NavigateState, State);
      function NavigateState(owner) {
        this.owner = owner;
        this.update = __bind(this.update, this);
      }
      NavigateState.prototype.update = function() {
        NavigateState.__super__.update.call(this);
        this.owner.setVector(this.owner.target[0], this.owner.target[1]);
        if (this.owner.isNearWaypoint()) {
          setTimeout(__bind(function() {
            return this.owner.emitAura();
          }, this), 100);
          this.enter(IdleState);
        }
        return this.owner.addForce(this.owner.maxForce);
      };
      return NavigateState;
    })();
    Waypoint = (function() {
      function Waypoint(director, x, y) {
        this.x = x;
        this.y = y;
        this.waypoint = new CAAT.Actor().setBackgroundImage(director.getImage('waypoint')).centerAt(x, y).setScale(0.1, 0.1);
        director.scenes[0].activeChildren.addChild(this.waypoint);
      }
      return Waypoint;
    })();
    return Character;
  });
}).call(this);
