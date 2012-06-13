ig.module(
    'game.entities.cue'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityCue = ig.Entity.extend({
        type: 'push',
        delta: 0.0
    })
})