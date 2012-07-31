(function() {
  var Timer;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
  window.Timer = Timer;
}).call(this);
