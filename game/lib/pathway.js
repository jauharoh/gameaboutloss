(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(function() {
    var Pathway;
    Pathway = (function() {
      function Pathway() {}
      return Pathway;
    })();
    ({
      width: 10,
      style: 'rgba(0,255,50,.5)',
      waypoints: [],
      constructor: function(director, owner) {
        this.owner = owner;
        this.actor = new CAAT.Actor().setBounds(0, 0, director.width, director.height);
        return this.actor.paint = this.paint;
      },
      paint: __bind(function(director, time) {
        var ctx, waypoint, _i, _len, _ref;
        ctx = director.ctx;
        ctx.strokeStyle = this.style;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.owner.getActorCenter()[0], this.owner.getActorCenter()[1]);
        if (this.owner.currentWaypoint) {
          this.lineTo(ctx, this.owner.currentWaypoint);
          _ref = this.owner.waypoints;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            waypoint = _ref[_i];
            this.lineTo(ctx, waypoint);
          }
        }
        return ctx.stroke();
      }, this),
      lineTo: function(ctx, waypoint) {
        return ctx.lineTo(waypoint.x, waypoint.y);
      }
    });
    return Pathway;
  });
}).call(this);
