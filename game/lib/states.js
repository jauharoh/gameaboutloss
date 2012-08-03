(function() {
  var modules;
  require.config({
    baseUrl: "./game/lib/states/"
  });
  modules = ['revolving', 'singing', 'listening'];
  define(modules, function() {
    var arg, states, _i, _len;
    states = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      arg = arguments[_i];
      states[modules[_i]] = arg;
    }
    return states;
  });
}).call(this);
