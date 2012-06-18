(function() {
  var Background, Player, Sound, preload, start;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
  Player = (function() {
    Player.prototype.deviceScale = window.innerHeight / 768;
    function Player(director) {
      this.director = director;
      this.updatePath = __bind(this.updatePath, this);
      this.moveTo = __bind(this.moveTo, this);
      this.move = __bind(this.move, this);
      this.maxScale = 1.2 * this.deviceScale;
      this.minScale = 0.35 * this.deviceScale;
      this.baseScale = 1 * this.deviceScale;
      this.actor = new CAAT.Actor().setBackgroundImage(this.director.getImage('player'));
      this.actor.mouseDown = __bind(function() {
        return this.shrink();
      }, this);
      this.actor.mouseUp = __bind(function() {
        window.ding.play();
        return this.release();
      }, this);
      this.actor.touchStart = __bind(function(e) {
        var touch;
        touch = e.changedTouches[0];
        return this.shrink();
      }, this);
      this.actor.touchEnd = __bind(function(e) {
        return this.release();
      }, this);
      this.moveEase = new CAAT.Interpolator().createExponentialOutInterpolator(2, false);
      this.shrinkEase = new CAAT.Interpolator().createExponentialOutInterpolator(4, false);
      this.releaseEase = new CAAT.Interpolator().createExponentialOutInterpolator(2, false);
      this.revertEase = new CAAT.Interpolator().createElasticOutInterpolator(1, 0.5);
      this.shrinkBehavior = new CAAT.ScaleBehavior().setCycle(false).setValues(this.baseScale, this.minScale, this.baseScale, this.minScale, 0.5, 0.5).setInterpolator(this.shrinkEase).setId(1);
      this.releaseBehavior = new CAAT.ScaleBehavior().setCycle(false).setValues(0.85, this.maxScale, 0.85, this.maxScale, 0.5, 0.5).setInterpolator(this.shrinkEase).setId(2).addListener({
        behaviorExpired: __bind(function() {
          return this.revert();
        }, this)
      });
      this.revertBehavior = new CAAT.ScaleBehavior().setValues(this.maxScale, this.baseScale, this.maxScale, this.baseScale, 0.5, 0.5).setInterpolator(this.revertEase).setId(3);
    }
    Player.prototype.move = function(e) {
      var x, y;
      x = this.actor.x;
      y = this.actor.y;
      this.actor.x = x + ((e.pageX - this.actor.width / 2) - x) / 30;
      return this.actor.y = y + ((e.pageY - this.actor.height / 2) - y) / 30;
    };
    Player.prototype.moveTo = function(x, y) {
      var b, length, tx, ty;
      this.moving = true;
      tx = x - this.actor.width / 2;
      ty = y - this.actor.height / 2;
      this.path = new CAAT.LinearPath().setInitialPosition(this.actor.x, this.actor.y).setFinalPosition(tx, ty);
      console.log(length = Math.sqrt(Math.pow(Math.abs(this.actor.x - tx), 2) + Math.pow(Math.abs(this.actor.y - ty), 2)));
      b = new CAAT.PathBehavior().setPath(this.path).setInterpolator(this.moveEase);
      b.setFrameTime(this.director.time, length * 2);
      return this.actor.addBehavior(b);
    };
    Player.prototype.updatePath = function(x, y) {
      var tx, ty;
      tx = x - this.actor.width / 2;
      ty = y - this.actor.height / 2;
      return this.path.setFinalPosition(tx, ty);
    };
    Player.prototype.revert = function() {
      this.revertBehavior.setFrameTime(this.director.time, 800);
      return this.actor.addBehavior(this.revertBehavior);
    };
    Player.prototype.shrink = function() {
      this.shrinkBehavior.setFrameTime(this.director.time, 3000);
      console.log(this.baseScale);
      this.actor.removeBehaviorById(2).removeBehaviorById(3);
      return this.actor.addBehavior(this.shrinkBehavior);
    };
    Player.prototype.release = function() {
      var aScale, aura, bScale;
      window.ding.play();
      bScale = new CAAT.ScaleBehavior().setCycle(false).setValues(0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.2 * this.deviceScale, 1.2 * this.deviceScale, 0.5, 0.5).setInterpolator(this.releaseEase).setFrameTime(this.director.time, 800);
      aScale = new CAAT.AlphaBehavior().setCycle(false).setValues(1, 0).setInterpolator(this.releaseEase).setFrameTime(this.director.time, 800);
      aura = new CAAT.Actor().setBackgroundImage(this.director.getImage('aura')).centerAt(this.actor.x + this.actor.width / 2, this.actor.y + this.actor.height / 2).setFrameTime(this.director.time, 800).addBehavior(bScale).addBehavior(aScale);
      this.director.scenes[0].activeChildren.addChild(aura);
      this.actor.removeBehaviorById(1);
      this.releaseBehavior.setFrameTime(this.director.time, 120).setValues(this.actor.scaleX, this.maxScale, this.actor.scaleY, this.maxScale, 0.5, 0.5);
      return this.actor.addBehavior(this.releaseBehavior);
    };
    return Player;
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
        id: 'aura',
        url: 'game/assets/images/aura.png'
      }
    ], __bind(function(counter, images) {
      if (counter === images.length) {
        return start(images);
      }
    }, this));
  };
  start = function(images) {
    var background, canvas, container, director, movePlayerTo, player, scene, updatePlayerPath;
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
    director.onRenderStart = function() {
      if (director.mousePos) {
        return player.move(director.mousePos);
      }
    };
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
      var touch;
      touch = e.changedTouches[0];
      return movePlayerTo(touch.pageX, touch.pageY);
    };
    container.touchEnd = function() {
      return player.release();
    };
    movePlayerTo = function(x, y) {
      return player.moveTo(x, y);
    };
    updatePlayerPath = function(x, y) {
      return player.updatePath(x, y);
    };
    player = window.player = new Player(director);
    background = new Background(director);
    scene.addChild(background.actor);
    scene.addChild(container);
    scene.addChild(player.actor);
    player.actor.setLocation(300, 300);
    return CAAT.loop(1);
  };
}).call(this);
