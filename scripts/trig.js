(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.trig = {
    getPointFromVector: __bind(function(radian) {
      var eight, flip, isFlat, pi, point, r, vector, x, xFunc, y, yFunc;
      if (radian % (Math.PI * 0.5) === 0) {
        isFlat = true;
      } else {
        isFlat = false;
      }
      eight = Math.floor(radian / (Math.PI * 0.25));
      vector = {
        quadrant: Math.floor(radian / (Math.PI * 0.5)),
        isEven: isFlat
      };
      pi = Math.PI;
      if (isFlat) {
        r = vector.quadrant % 2;
        x = 1 - r;
        y = r;
      } else {
        r = radian - pi * vector.quadrant;
        if (r > pi / 4) {
          flip = true;
          r = pi / 2 - r;
        }
        switch (eight) {
          case 0 || 3 || 4 || 7:
            yFunc = Math.cos;
            xFunc = Math.sin;
            break;
          default:
            yFunc = Math.sin;
            xFunc = Math.cos;
        }
        x = xFunc(r);
        y = yFunc(r);
      }
      switch (vector.quadrant) {
        case 1:
          x = -x;
          break;
        case 2:
          x = -x;
          y = -y;
          break;
        case 3:
          y = -y;
      }
      return point = {
        x: x,
        y: y
      };
    }, this)
  };
}).call(this);
