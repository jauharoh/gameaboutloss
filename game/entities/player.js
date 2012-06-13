
ig.module(
    'game.entities.player'
)

.requires(
    'impact.entity',
    'game.entities.character'
)

.defines(function() {
    EntityPlayer = EntityCharacter.extend({
        rgba: 'rgba(0,255,0,.8)',
        shape: null,

        init: function(x,y,settings){
            this.parent(x,y,settings);
            this.color.darken(.2);
//            this.shape = jc.circle(this.pos.x, this.pos.y, this.size.x, this.color.rgbaString(), true).id('player')
//            jc.circle()
        },


        draw: function(){
            this.parent();
//            jc.start('canvas');
        },
        pulse: function(){
            this.setState('releasing');
            this.lastIdleSize = this.idleSize;
            this.pulseSize = 35;
        },

        update: function(){
//            if(ig.input.pressed('tap')){
////                this.holdTimer = new ig.Timer()
//            }
//            else if(ig.input.state('tap')){
//
//                if(this.holdTimer.delta()>.1){
//                    this.pulseSize = 15;
//                }
//                else{
//                    this.pulseSize = 23;
//                }
//                this.setState('pushing');
//            }

            this.parent();
        },
        pulsate: function(){
            this.parent();
        },

        revert: function(){
            this.parent();
        }
    })
})