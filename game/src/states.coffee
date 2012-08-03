require.config
  baseUrl: "./game/lib/states/"

modules = [
  'revolving',
  'singing',
  'listening'
]

define modules, ->
  states = []
  for arg in arguments
    states[modules[_i]] = arg
  return states
