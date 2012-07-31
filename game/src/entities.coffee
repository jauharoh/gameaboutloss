modules = [
  'timer',
  'player',
  'companion',
  'musicManager',
  'background',
  'pathway'
]

define modules, ->
  entities = []
  for arg in arguments
    entities[modules[_i]] = arg
  return entities
