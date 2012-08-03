(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(function() {
    var State;
    State = (function() {
      function State(owner) {
        this.owner = owner;
        this.enter = __bind(this.enter, this);
        this.update = __bind(this.update, this);
      }
      State.prototype.update = function() {
        return this.owner.updateRadialPosition();
      };
      State.prototype.enter = function(state, option) {
        if (option == null) {
          option = null;
        }
        return this.owner.setCurrentState(state, option);
      };
      return State;
    })();
    return State;
  });
}).call(this);
