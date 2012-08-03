(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(function() {
    var Messenger;
    Messenger = (function() {
      function Messenger() {
        this.broadcast = __bind(this.broadcast, this);
        this.add = __bind(this.add, this);        this.entities = [];
      }
      Messenger.prototype.add = function(entity) {
        this.entities.push(entity);
        entity.setProperty({
          messenger: this,
          id: this.entities.length
        });
        return this;
      };
      Messenger.prototype.broadcast = function(sender, message) {
        var entity, _i, _len, _ref, _results;
        _ref = this.entities;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entity = _ref[_i];
          if (entity.id !== sender.id) {
            _results.push(entity.receiveMessage(message));
          }
        }
        return _results;
      };
      return Messenger;
    })();
    return Messenger;
  });
}).call(this);
