(function() {
  var modules;
  modules = ['timer', 'player', 'companion', 'musicManager', 'background', 'pathway', 'messenger'];
  define(modules, function() {
    var arg, entities, _i, _len;
    entities = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      arg = arguments[_i];
      entities[modules[_i]] = arg;
    }
    return entities;
  });
}).call(this);
