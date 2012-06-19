(function() {
  var Background, Character, Companion, Player, Sound, Timer, preload, start;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sound = (function() {
    function Sound(src) {
      var audio;
      audio = new Audio();
      audio.src = src;
      audio.load();
      this.audio = audio;
    }
    Sound.prototype.play = function() {
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
  Background = (function() {
    function Background(director) {
      this.director = director;
      this.actor = new CAAT.ShapeActor().setLocation(0, 0).setSize(window.innerWidth, window.innerHeight).setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).setFillStyle('#D3EFF5');
    }
    return Background;
  })();
  Character = (function() {
    Character.prototype.deviceScale = window.innerHeight / 768;
    Character.prototype.events = [];
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
    function Character(name, director) {
      this.name = name;
      this.director = director;
      this.release = __bind(this.release, this);
      this.shrink = __bind(this.shrink, this);
      this.revert = __bind(this.revert, this);
      this.behave = __bind(this.behave, this);
      this.rest = __bind(this.rest, this);
      this.move = __bind(this.move, this);
      this.update = __bind(this.update, this);
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
      this.initialize();
      this.initEvents();
    }
    Character.prototype.initialize = function() {
      this.behaviors.shrink.setCycle(false).setValues(this.baseScale, this.minScale, this.baseScale, this.minScale, 0.5, 0.5).setInterpolator(this.interps.shrink);
      this.behaviors.release.setCycle(false).setValues(0.85, this.maxScale, 0.85, this.maxScale, 0.5, 0.5).setInterpolator(this.interps.shrink).addListener({
        behaviorExpired: __bind(function(behavior, time, actor) {
          if (actor.id === this.actor.id) {
            this.revert();
          }
          if (actor.id === this.actor.id) {
            return console.log(actor.id);
          }
        }, this)
      });
      return this.behaviors.revert.setValues(this.maxScale, this.baseScale, this.maxScale, this.baseScale, 0.5, 0.5).setInterpolator(this.interps.revert);
    };
    Character.prototype.initEvents = function() {
      var event, _results;
      if (this.events != null) {
        _results = [];
        for (event in this.events) {
          console.log(event, this[this.events[event]]);
          _results.push(this.actor[event] = this[this.events[event]]);
        }
        return _results;
      }
    };
    Character.prototype.update = function() {};
    Character.prototype.move = function(e) {
      var x, y;
      x = this.actor.x;
      y = this.actor.y;
      this.vel.x = ((e.pageX - this.actor.width / 2) - x) / 30;
      this.vel.y = ((e.pageY - this.actor.height / 2) - y) / 30;
      this.actor.x = x + this.vel.x;
      return this.actor.y = y + this.vel.y;
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
      return this.actor.addBehavior(this.behaviors[behavior]);
    };
    Character.prototype.revert = function() {
      this.behaviors.revert.setFrameTime(this.director.time, 800);
      return this.behave('revert');
    };
    Character.prototype.shrink = function() {
      this.behaviors.shrink.setFrameTime(this.director.time, 3000);
      return this.behave('shrink');
    };
    Character.prototype.release = function() {
      var aura, bAlpha, bScale;
      window.ding.play();
      bScale = new CAAT.ScaleBehavior().setCycle(false).setValues(0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.5, 0.5).setInterpolator(this.interps.release).setFrameTime(this.director.time, 800);
      bAlpha = new CAAT.AlphaBehavior().setCycle(false).setValues(1, 0).setInterpolator(this.interps.release).setFrameTime(this.director.time, 800);
      aura = new CAAT.Actor().setBackgroundImage(this.director.getImage(this.name + '-aura')).centerAt(this.actor.x + this.actor.width / 2, this.actor.y + this.actor.height / 2).setFrameTime(this.director.time, 800).addBehavior(bAlpha).addBehavior(bScale);
      this.director.scenes[0].activeChildren.addChild(aura);
      this.behaviors.release.setFrameTime(this.director.time, 120).setValues(this.actor.scaleX, this.maxScale, this.actor.scaleY, this.maxScale, 0.5, 0.5);
      return this.behave('release');
    };
    return Character;
  })();
  Player = (function() {
    __extends(Player, Character);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.events = {
      'mouseDown': 'shrink',
      'mouseUp': 'release',
      'touchStart': 'shrink',
      'touchEnd': 'release'
    };
    return Player;
  })();
  Timer = (function() {
    function Timer(director) {
      this.director = director;
      this.startTime = this.director.time;
    }
    Timer.prototype.getTime = function() {
      return this.director.time - this.startTime;
    };
    return Timer;
  })();
  Companion = (function() {
    __extends(Companion, Character);
    Companion.prototype.proximity = 100;
    function Companion(director, name, player) {
      this.director = director;
      this.name = name;
      this.player = player;
      this.react = __bind(this.react, this);
      this.update = __bind(this.update, this);
      Companion.__super__.constructor.call(this, this.director, this.name);
      this.reactionTimer = new Timer(this.director);
    }
    Companion.prototype.update = function() {
      this.pathToPlayer = new CAAT.LinearPath().setInitialPosition(this.actor.x, this.actor.y).setFinalPosition(this.player.actor.x, this.player.actor.y);
      if (this.pathToPlayer.updatePath().getLength() < 300) {
        return this.react();
      }
    };
    Companion.prototype.react = function() {
      if (this.reactionTimer.getTime() > 1000) {
        this.release();
        return this.reactionTimer = new Timer(this.director);
      }
    };
    return Companion;
  })();
  window.addEventListener('load', function() {
    return preload();
  });
  CAAT.TOUCH_BEHAVIOR = CAAT.TOUCH_AS_MULTITOUCH;
  preload = function() {
    return window.images = new CAAT.ImagePreloader().loadImages([
      {
        id: 'player',
        url: 'game/assets/images/player.png'
      }, {
        id: 'player-aura',
        url: 'game/assets/images/aura.png'
      }, {
        id: 'companion-aura',
        url: 'game/assets/images/companion-aura.png'
      }, {
        id: 'companion',
        url: 'game/assets/images/companion-body.png'
      }
    ], __bind(function(counter, images) {
      if (counter === images.length) {
        return start(images);
      }
    }, this));
  };
  start = function(images) {
    var background, canvas, companion, container, director, movePlayerTo, player, scene, updatePlayerPath;
    window.music = new Sound('game/assets/soundtracks/unity_1.mp3');
    window.ding = new Sound('game/assets/sounds/ding.mp3');
    window.music.audio.addEventListener('ended', window.music.play());
    window.music.play();
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    director = window.director = new CAAT.Director().initialize(window.innerWidth, window.innerHeight, canvas);
    director.setImagesCache(images);
    scene = director.createScene();
    container = new CAAT.ActorContainer().setBounds(0, 0, window.innerWidth, window.innerHeight).setGestureEnabled(false);
    container.mouseDown = function(e) {
      return director.mousePos = e.sourceEvent;
    };
    container.mouseDrag = function(e) {
      return director.mousePos = e.sourceEvent;
    };
    container.mouseUp = function() {
      return director.mousePos = null;
    };
    container.touchStart = function(e) {
      return director.mousePos = e.changedTouches[0];
    };
    container.touchMove = function(e) {
      return director.mousePos = e.changedTouches[0];
    };
    container.touchEnd = function() {
      return director.mousePos = null;
    };
    movePlayerTo = function(x, y) {
      return player.moveTo(x, y);
    };
    updatePlayerPath = function(x, y) {
      return player.updatePath(x, y);
    };
    player = window.player = new Player('player', director);
    window.companion = companion = new Companion('companion', director, player);
    background = new Background(director);
    scene.addChild(background.actor);
    scene.addChild(container);
    scene.addChild(player.actor);
    container.addChild(companion.actor);
    director.onRenderStart = function() {
      companion.update();
      if (director.mousePos) {
        return player.move(director.mousePos);
      } else {
        return player.rest();
      }
    };
    player.actor.setLocation(300, 300);
    return CAAT.loop(1);
  };
}).call(this);
