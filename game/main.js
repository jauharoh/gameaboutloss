(function() {
  var Actor, Circle, Game, Player, Rectangle, Sound, start;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Game = (function() {
    function Game(options) {
      this.options = options;
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);
      this.tap = __bind(this.tap, this);
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
      this.canvas.addEventListener('touchstart', this.tap);
      this.ctx = this.canvas.getContext('2d');
      document.body.appendChild(this.canvas);
      this.entities = [];
      setInterval(__bind(function() {
        return this.update();
      }, this), 1000 / 60);
    }
    Game.prototype.tap = function() {
      this.ding.play();
      return this.music.play();
    };
    Game.prototype.addEntity = function(entity) {
      return this.entities.push(entity);
    };
    Game.prototype.update = function() {};
    Game.prototype.draw = function() {
      var entity, _i, _len, _ref, _results;
      console.log('draw');
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        _results.push(entity.draw(this.ctx));
      }
      return _results;
    };
    return Game;
  })();
  Actor = (function() {
    function Actor(shape, voice) {
      this.shape = shape;
      this.voice = voice;
      this.release = __bind(this.release, this);
      this.shrink = __bind(this.shrink, this);
      this.shape.addEventListener('mousedown', this.shrink);
      this.shape.addEventListener('mouseup mouseout', this.release);
    }
    Actor.prototype.shrink = function() {
      return this.shape.scale = 2;
    };
    Actor.prototype.release = function() {
      this.voice.play();
      return this.shape.transitionTo({
        duration: 0.06,
        easing: 'ease-out',
        scale: {
          x: 1.2,
          y: 1.2
        },
        callback: __bind(function() {
          return this.shape.transitionTo({
            duration: 0.5,
            easing: 'elastic-ease-out',
            scale: {
              x: 1,
              y: 1
            }
          });
        }, this)
      });
    };
    return Actor;
  })();
  Sound = (function() {
    function Sound(src) {
      var audio;
      audio = new Audio();
      audio.src = src;
      audio.load();
      audio.play();
      this.audio = audio;
    }
    Sound.prototype.play = function() {
      this.audio.currentTime = 0.5;
      return this.audio.play();
    };
    Sound.prototype.stop = function() {
      this.audio.pause();
      return this.audio.currentTime = 0;
    };
    Sound.prototype.pause = function() {
      return this.audio.pause();
    };
    return Sound;
  })();
  Rectangle = (function() {
    function Rectangle(options) {
      this.options = options;
      this.canvas = document.createElement('canvas');
      this.canvas.id = this.options.id;
      this.canvas.zIndex = this.options.zIndex;
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.draw();
    }
    Rectangle.prototype.draw = function() {
      this.ctx.beginPath();
      this.ctx.rect(this.options.x, this.options.y, this.options.width, this.options.height);
      this.ctx.fillStyle = this.options.fill;
      this.ctx.closePath();
      return this.ctx.fill();
    };
    Rectangle.prototype.update = function() {};
    return Rectangle;
  })();
  Circle = (function() {
    function Circle(options) {
      this.options = options;
      this.update = __bind(this.update, this);
      this.attrs = {};
    }
    Circle.prototype.update = function() {
      var option, _results;
      for (option in this.options) {
        if (option !== "styles") {
          if (this.options[option] !== this.attrs[option]) {
            console.log(this.options[option], this.attrs[option]);
            console.log('updated');
            break;
          }
        }
      }
      _results = [];
      for (option in this.options) {
        if (option !== 'styles') {
          _results.push(this.attrs[option] = this.options[option]);
        }
      }
      return _results;
    };
    Circle.prototype.draw = function(ctx) {
      ctx.beginPath();
      ctx.arc(50, 50, this.options.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.options.fill;
      ctx.closePath();
      return ctx.fill();
    };
    return Circle;
  })();
  Player = (function() {
    function Player(director) {
      this.director = director;
      this.actor = new CAAT.ShapeActor().setLocation(20, 20).setSize(60, 60).setFillStyle('#FFFFFF').setStrokeStyle('#000000');
      this.actor.mouseDown = __bind(function() {
        return this.shrink();
      }, this);
      this.actor.mouseUp = __bind(function() {
        window.ding.play();
        return this.release();
      }, this);
      this.shrinkEase = new CAAT.Interpolator().createExponentialOutInterpolator(4, false);
      this.releaseEase = new CAAT.Interpolator().createExponentialOutInterpolator(2, false);
      this.revertEase = new CAAT.Interpolator().createExponentialInOutInterpolator(6, false);
      this.shrinkBehavior = new CAAT.ScaleBehavior().setCycle(false).setValues(1, 0.85, 1, 0.85, 0.5, 0.5).setInterpolator(this.shrinkEase);
      this.releaseBehavior = new CAAT.ScaleBehavior().setCycle(false).setValues(0.85, 1.4, 0.85, 1.4, 0.5, 0.5).setInterpolator(this.shrinkEase).addListener({
        behaviorExpired: __bind(function() {
          return this.revert();
        }, this)
      });
      this.revertBehavior = new CAAT.ScaleBehavior().setValues(1.4, 1, 1.4, 1, 0.5, 0.5).setInterpolator(this.revertEase);
    }
    Player.prototype.revert = function() {
      this.revertBehavior.setFrameTime(this.director.time, 100);
      return this.actor.addBehavior(this.revertBehavior);
    };
    Player.prototype.shrink = function() {
      this.shrinkBehavior.setFrameTime(this.director.time, 100);
      return this.actor.addBehavior(this.shrinkBehavior);
    };
    Player.prototype.release = function() {
      this.releaseBehavior.setFrameTime(this.director.time, 120);
      return this.actor.addBehavior(this.releaseBehavior);
    };
    return Player;
  })();
  window.addEventListener('load', function() {
    return start();
  });
  start = function() {
    var canvas, director, player, scene;
    player = new Circle({
      radius: 50,
      id: 'player',
      x: 300,
      y: 200,
      fill: "green",
      sX: 1,
      sY: 1,
      styles: {
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'none'
      }
    });
    window.music = new Sound('track_1.mp3');
    window.ding = new Sound('ding.mp3');
    window.music.play();
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = 1024;
    canvas.height = 768;
    window.director = director = new CAAT.Director().initialize(1024, 768, canvas);
    scene = director.createScene();
    window.player = new Player(director);
    scene.addChild(window.player.actor);
    return CAAT.loop(1);
  };
}).call(this);
