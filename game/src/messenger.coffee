define ->
  class Messenger
    constructor: ->
      @entities = []

    add: (entity) =>
      @entities.push(entity)
      entity.setProperty
        messenger: @
        id: @entities.length
      @

    broadcast: (sender, message) =>
      for entity in @entities when entity.id isnt sender.id
        entity.receiveMessage(message)

  return Messenger

