(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(['./timer', './states'], function(Timer, State) {
    var Character, Waypoint;
    Character = (function() {
      Character.prototype.deviceScale = window.innerHeight / 768;
      Character.prototype.events = {};
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
      Character.prototype.radius = 140;
      Character.prototype.scale = 0.5;
      Character.prototype.speed = 0;
      Character.prototype.maxSpeed = 0.02;
      Character.prototype.behaviors = {
        shrink: new CAAT.ScaleBehavior(),
        release: new CAAT.ScaleBehavior(),
        revert: new CAAT.ScaleBehavior(),
        alpha: new CAAT.AlphaBehavior(),
        rotate: new CAAT.RotateBehavior()
      };
      Character.prototype.interps = {
        shrink: new CAAT.Interpolator().createExponentialOutInterpolator(4, false),
        move: new CAAT.Interpolator().createExponentialOutInterpolator(2, false),
        shrink: new CAAT.Interpolator().createExponentialOutInterpolator(4, false),
        release: new CAAT.Interpolator().createExponentialOutInterpolator(2, false),
        revert: new CAAT.Interpolator().createElasticOutInterpolator(1, 0.5),
        inOut: new CAAT.Interpolator().createExponentialInOutInterpolator(1, false)
      };
      function Character(name, director, other) {
        this.name = name;
        this.director = director;
        this.other = other;
        this.setCurrentState = __bind(this.setCurrentState, this);
        this.enterState = __bind(this.enterState, this);
        this.release = __bind(this.release, this);
        this.emitAura = __bind(this.emitAura, this);
        this.shrink = __bind(this.shrink, this);
        this.rotate = __bind(this.rotate, this);
        this.reactNegative = __bind(this.reactNegative, this);
        this.setProperty = __bind(this.setProperty, this);
        this.sendMessage = __bind(this.sendMessage, this);
        this.receiveMessage = __bind(this.receiveMessage, this);
        this.revert = __bind(this.revert, this);
        this.behave = __bind(this.behave, this);
        this.rest = __bind(this.rest, this);
        this.push = __bind(this.push, this);
        this.updateRadialPosition = __bind(this.updateRadialPosition, this);
        this.updateSpeed = __bind(this.updateSpeed, this);
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
        this.setScale = __bind(this.setScale, this);
        this.vel = {
          x: 0,
          y: 0
        };
        this.radius = screen.height / 4 - ((screen.height / 2) * 0.2);
        this.setScale();
        this.actor = new CAAT.Actor().setBackgroundImage(this.director.getImage(this.name));
        this.actor.setScale(this.baseScale, this.baseScale);
        this.actor.name = this.name;
        this.target = [this.actor.x, this.actor.y];
        this.accelerationTimer = new Timer(this.director);
        this.initialize();
        this.initEvents();
      }
      Character.prototype.setScale = function() {
        this.maxScale = (this.scale * 1.1) * this.deviceScale;
        this.minScale = (this.scale * 0.9) * this.deviceScale;
        return this.baseScale = this.scale * this.deviceScale;
      };
      Character.prototype.initialize = function() {};
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
      Character.prototype.currentState = {
        update: function() {}
      };
      Character.prototype.update = function() {
        this.currentState.update();
        return this.updateSpeed();
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
      Character.prototype.updateSpeed = function() {
        return this.speed -= this.speed / 40;
      };
      Character.prototype.updateRadialPosition = function() {
        this.radian += this.speed;
        this.actor.x = window.innerWidth / 3 + this.radius * Math.cos(this.radian) - this.actor.width / 2;
        return this.actor.y = window.innerHeight / 3 + this.radius * Math.sin(this.radian) - this.actor.height / 2;
      };
      Character.prototype.push = function() {
        this.speed = this.maxSpeed;
        return this.release();
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
      Character.prototype.receiveMessage = function(message) {
        var name, _results;
        _results = [];
        for (name in message) {
          if (name === 'event') {
            _results.push(this[message[name]]());
          }
        }
        return _results;
      };
      Character.prototype.sendMessage = function(message) {
        return this.messenger.broadcast(this, message);
      };
      Character.prototype.setProperty = function(properties) {
        var property, _results;
        _results = [];
        for (property in properties) {
          _results.push(this[property] = properties[property]);
        }
        return _results;
      };
      Character.prototype.reactNegative = function() {
        this.shakeCount = 3;
        return this.rotate(0, Math.PI * 0.1);
      };
      Character.prototype.rotate = function(start, end) {
        var behavior;
        behavior = new CAAT.RotateBehavior().setValues(start, end).setFrameTime(this.director.time, 150).setInterpolator(this.interps.inOut);
        if (this.shakeCount > 0) {
          behavior.addListener({
            behaviorExpired: __bind(function(behavior, time, actor) {
              start = end;
              if (this.shakeCount === 1) {
                end = 0;
              } else {
                end = -start;
              }
              this.rotate(start, end);
              return this.shakeCount -= 1;
            }, this)
          });
        }
        return this.behave(behavior);
      };
      Character.prototype.shrink = function() {
        var behavior;
        behavior = new CAAT.ScaleBehavior().setCycle(false).setValues(this.actor.scaleX, this.minScale, this.actor.scaleY, this.minScale, 0.5, 0.5).setInterpolator(this.interps.shrink).setFrameTime(this.director.time, 3000);
        return this.behave(behavior);
      };
      Character.prototype.emitAura = function() {
        var aura, bAlpha, bScale;
        bScale = new CAAT.ScaleBehavior().setCycle(false).setValues(0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.5, 0.5).setInterpolator(this.interps.release).setFrameTime(this.director.time, 800);
        bAlpha = new CAAT.AlphaBehavior().setCycle(false).setValues(1, 0).setInterpolator(this.interps.release).setFrameTime(this.director.time, 800);
        aura = new CAAT.Actor().setBackgroundImage(this.director.getImage(this.name + '-aura')).centerAt(this.actor.x + this.actor.width / 2, this.actor.y + this.actor.height / 2).setFrameTime(this.director.time, 800).addBehavior(bAlpha).addBehavior(bScale);
        return this.director.scenes[0].activeChildren.addChild(aura);
      };
      Character.prototype.release = function() {
        var behavior;
        this.director.getAudioManager().play('ding');
        behavior = new CAAT.ScaleBehavior().setCycle(false).setValues(0.85, this.maxScale, 0.85, this.maxScale, 0.5, 0.5).setInterpolator(this.interps.shrink).setFrameTime(this.director.time, 120).setValues(this.actor.scaleX, this.maxScale, this.actor.scaleY, this.maxScale, 0.5, 0.5).addListener({
          behaviorExpired: __bind(function(behavior, time, actor) {
            return this.revert();
          }, this)
        });
        return this.behave(behavior);
      };
      Character.prototype.enterState = function(name, option) {
        if (option == null) {
          option = null;
        }
        return this.currentState = new State[name](this, option);
      };
      Character.prototype.setCurrentState = function(state, option) {
        if (option == null) {
          option = null;
        }
        return this.currentState = new state(this, option);
      };
      return Character;
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
