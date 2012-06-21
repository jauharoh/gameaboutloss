(function() {
  var Background, Character, Companion, MusicManager, Player, Timer, preload, start;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
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
    Character.prototype.mass = 100;
    Character.prototype.vel = 0;
    Character.prototype.accelerationTimer = null;
    Character.prototype.force = 0;
    Character.prototype.maxForce = 0;
    Character.prototype.friction = 0.05;
    Character.prototype.orientation = 0;
    Character.prototype.normalizedVector = [0, 0];
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
      this.release = __bind(this.release, this);
      this.emitAura = __bind(this.emitAura, this);
      this.shrink = __bind(this.shrink, this);
      this.revert = __bind(this.revert, this);
      this.behave = __bind(this.behave, this);
      this.rest = __bind(this.rest, this);
      this.move = __bind(this.move, this);
      this.update = __bind(this.update, this);
      this.setVector = __bind(this.setVector, this);
      this.setOrientation = __bind(this.setOrientation, this);
      this.setForce = __bind(this.setForce, this);
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
      this.target = [0, 0];
      this.accelerationTimer = new Timer(this.director);
      this.initialize();
      this.initEvents();
    }
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
    Character.prototype.setForce = function(force) {
      this.accelerationTimer = new Timer(this.director);
      this.force = force;
      return this;
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
      this.normalizedVector = [nx, ny];
      return this;
    };
    Character.prototype.update = function() {
      var accel, velocity;
      accel = this.force / this.mass;
      velocity = accel * this.accelerationTimer.getTime();
      velocity *= 0.95;
      this.vel.x -= this.normalizedVector[0] * this.force;
      this.vel.y -= this.normalizedVector[1] * this.force;
      this.vel.x *= 1 - this.friction;
      this.vel.y *= 1 - this.friction;
      this.actor.x += this.vel.x;
      return this.actor.y += this.vel.y;
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
    return Character;
  })();
  Player = (function() {
    __extends(Player, Character);
    Player.prototype.events = {
      'mouseDown': 'shrink',
      'mouseUp': 'release',
      'touchStart': 'shrink',
      'touchEnd': 'release'
    };
    function Player(name, director, other) {
      this.release = __bind(this.release, this);
      this.update = __bind(this.update, this);      Player.__super__.constructor.call(this, name, director, other);
    }
    Player.prototype.update = function() {
      var distanceToTarget;
      distanceToTarget = Math.abs(Math.sqrt(Math.pow((this.actor.x + this.actor.width / 2) - this.target[0], 2) + Math.pow((this.actor.y + this.actor.height / 2) - this.target[1], 2)));
      this.force = (distanceToTarget - this.actor.width / 2) / 200;
      if (this.force > 1) {
        this.force = 1;
      }
      if (this.force < .01) {
        this.force = 0;
      }
      this.force *= .6;
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
    return Player;
  })();
  Companion = (function() {
    __extends(Companion, Character);
    function Companion(name, director, other) {
      this.react = __bind(this.react, this);
      this.charge = __bind(this.charge, this);
      this.update = __bind(this.update, this);
      this.setTrack = __bind(this.setTrack, this);      Companion.__super__.constructor.call(this, name, director, other);
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
        music.next(4000);
        this.setTrack(music.tracks[music.currentIndex], 3, 300);
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
  Timer = (function() {
    function Timer(director) {
      this.director = director;
      this.reset = __bind(this.reset, this);
      this.reset();
    }
    Timer.prototype.getTime = function(offset) {
      if (offset == null) {
        offset = 0;
      }
      return this.director.time - this.startTime - offset;
    };
    Timer.prototype.reset = function() {
      return this.startTime = this.director.time;
    };
    return Timer;
  })();
  MusicManager = (function() {
    function MusicManager(director) {
      this.director = director;
      this.next = __bind(this.next, this);
      this.stop = __bind(this.stop, this);
      this.play = __bind(this.play, this);
      this.addTracks = __bind(this.addTracks, this);
      this.manager = new CAAT.AudioManager().initialize(8);
      this.currentTracks = [];
      this.stopping = [];
      this.tracks = [];
      this.currentIndex = 0;
    }
    MusicManager.prototype.update = function() {};
    MusicManager.prototype.addTracks = function(tracks) {
      var sound, track, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tracks.length; _i < _len; _i++) {
        track = tracks[_i];
        sound = new buzz.sound(track.url, {
          format: ['ogg'],
          preload: true
        });
        sound.bpm = track.bpm;
        sound.load();
        _results.push(this.tracks.push(sound));
      }
      return _results;
    };
    MusicManager.prototype.play = function(id, duration) {
      if (duration == null) {
        duration = 2000;
      }
      this.tracks[id].play().loop().fadeIn(duration);
      return this.currentTracks[id] = this.tracks[id];
    };
    MusicManager.prototype.stop = function(id, duration) {
      if (duration == null) {
        duration = 2000;
      }
      return this.tracks[id].fadeOut(duration, __bind(function() {
        return this.tracks[id].stop();
      }, this));
    };
    MusicManager.prototype.next = function(fade) {
      if (fade == null) {
        fade = 2000;
      }
      this.stop(this.currentIndex, fade);
      if (this.tracks[this.currentIndex + 1] != null) {
        this.currentIndex += 1;
      } else {
        this.currentIndex = 0;
      }
      return this.play(this.currentIndex, fade);
    };
    return MusicManager;
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
    var background, canvas, companion, container, director, dirs, movePlayerTo, music, player, scene, updatePlayerPath;
    dirs = {
      sound: 'game/assets/sound/',
      music: 'game/assets/music/'
    };
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    director = window.director = new CAAT.Director().initialize(window.innerWidth, window.innerHeight, canvas);
    window.music = music = new MusicManager(director);
    director.setImagesCache(images);
    director.addAudio('ding', dirs.sound + 'ding.mp3');
    music.addTracks([
      {
        id: 'intro',
        bpm: 110,
        url: dirs.music + 'intro.mp3'
      }, {
        id: 'harmony',
        bpm: 88,
        url: dirs.music + 'harmony.mp3'
      }, {
        id: 'disharmony',
        bpm: 88,
        url: dirs.music + 'disharmony.mp3'
      }
    ]);
    scene = director.createScene();
    container = new CAAT.ActorContainer().setBounds(0, 0, window.innerWidth, window.innerHeight).setGestureEnabled(false);
    movePlayerTo = function(x, y) {
      return player.moveTo(x, y);
    };
    updatePlayerPath = function(x, y) {
      return player.updatePath(x, y);
    };
    player = window.player = new Player('player', director);
    window.companion = companion = new Companion('companion', director, player);
    player.other = companion;
    background = new Background(director);
    scene.addChild(background.actor);
    scene.addChild(container);
    scene.addChild(player.actor);
    container.addChild(companion.actor);
    companion.setTrack(music.tracks[0], 3, 3);
    director.onRenderStart = function() {
      companion.update();
      player.update();
      return music.update();
    };
    player.actor.setLocation(300, 300);
    CAAT.loop(1);
    container.mouseDown = function(e) {
      return player.setVector(e.sourceEvent.pageX, e.sourceEvent.pageY).setForce(0.5);
    };
    container.mouseDrag = function(e) {
      return player.setVector(e.sourceEvent.pageX, e.sourceEvent.pageY).setForce(0.5);
    };
    container.mouseUp = function() {
      player.setForce(0);
      return director.mousePos = null;
    };
    container.touchStart = function(e) {
      return director.mousePos = e.changedTouches[0];
    };
    container.touchMove = function(e) {
      return director.mousePos = e.changedTouches[0];
    };
    return container.touchEnd = function() {
      return director.mousePos = null;
    };
  };
}).call(this);
