
ig.module(
    'game.entities.other'
)

    .requires(
    'impact.entity',
    'game.entities.character'
)

    .defines(function() {
        EntityOther = EntityCharacter.extend({
            color: 'rgba(0,0,255,1)',

            init: function(x,y,settings){
                this.parent(x,y,settings);
            },


            draw: function(){
                this.parent();
            },
            update: function(){
                if(ig.input.pressed('tap')){
                    this.holdTimer = new ig.Timer()
                }
                else if(ig.input.released('tap')){
                    this.pulse = true;
                    this.pulseSize = 35;
                    this.dingSFX.play();

                }
                else if(ig.input.state('tap')){

                    if(this.holdTimer.delta()>.1){
                        this.pulse = true;
                        this.pulseSize = 15;
                    }
                    else{
                        this.pulse = true;
                        this.pulseSize = 23;
                    }
                }

                this.parent();
            },
            pulsate: function(){
                var scaleAmount = (this.pulseSize - this.radius)/5;
                this.radius += scaleAmount;
                if(this.pulseSize > this.idleSize){
                    if(this.radius >= this.pulseSize-.2){
                        this.radius = this.pulseSize;
                        this.pulse = false;
                    }
                }
                else {
                    if(this.radius <= this.pulseSize+.2){
                        this.radius = this.pulseSize;
                        this.pulse = false;
                    }

                }
            },

            revert: function(){
                var scaleAmount = (this.radius - this.idleSize)/5;
                this.radius -= scaleAmount;
                if(this.radius < this.idleSize+.3){
                    this.radius = this.idleSize
                }
            }
        })
    })