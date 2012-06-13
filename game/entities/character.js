ig.module(
    'game.entities.character'
)

.requires(
    'impact.entity',
    'color'
)

.defines(function() {
    EntityCharacter = ig.Entity.extend({
        size:{x:25,y:25},
        radius: 25,
        posX: 0,
        posY: 0,
        color: null,
        alpha: 1,
        blur: 0,
        blurring: false,
        rgba: 'rgba(0,0,255,.5)',
        idleSize: 25,
        maxScale: 1.2,
        minScale: 0.5,
        holdTimer: null,
        override: false,
        maxBlur: 30,

        //States
        states:{
            idle: true,
            pushing: false,
            releasing: false,
            reverting: false,
            shaking: false,
            pulsing: false,
        },

        fx:{
            aura: false
        },

        init: function(x,y,settings){
            this.parent(x,y,settings);
            this.color = new EntityColor(this.rgba);
            this.idleSize = this.size.x;

        },


        draw: function(){
            this.parent();
            this.getPos();
            if(ig.input.pressed('tap')){
            }
            if(!this.hidden) this.drawShape();
        },
        getPos: function(){
            this.scale = ig.system.scale;
            this.screenX = window.innerWidth/2 + this.pos.x;
            this.screenY = (window.innerHeight/2 - this.pos.y)+2000;

        },
        drawShape: function(){
            var ctx = ig.system.context;
            var radius = this.size.x*this.scale;
            ctx.save();
            this.color.alpha(this.alpha);
            this.color.rgb(this.rgb);
            ctx.fillStyle = this.color.rgbString();
            ctx.beginPath();
            this.drawPath(ctx, radius, this.screenX, this.screenY, this.scale);
            ctx.closePath();
            this.drawShadow(ctx);
            ctx.fill();
            if(this.fx.aura == true){
                this.drawAura();
            }
            ctx.restore();
        },

        drawShadow: function(ctx){
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = -2000;
            ctx.shadowColor = this.color.rgbaString();
            ctx.shadowBlur = this.blur;
        },

        drawPath: function(ctx, radius,x, y,s) {
            ctx.arc(x,y, radius,0,2*Math.PI,false);
        },

        drawAura: function(){

        },

        triggerAura: function(){
            this.fx.aura = true;

        },

        hide: function(){
            this.hidden = true;
        },


        elate: function(){
            this.triggerAura();
        },

        show: function(){
            this.hidden = false;
        },


        update: function(){
            if(this.alpha < 0.01){
                this.hide();
            }
            else{
                this.show();
            }
            this.pos.x = this.posX;
            this.pos.y = this.posY;
            if(this.states.releasing){
                this.setState('pulsing');
//                this.maxScale = 1.2;

            }
            else if(this.states.pushing){
                this.setState('pulsing');
                this.maxScale = .7;
            }
            if(this.states.pulsing){
                this.pulsate();
            }
            if(this.states.reverting){
                this.revert();
            }
            if(this.states.idle){
                this.size.x = this.idleSize;
                this.size.y = this.idleSize;
            }
            if(this.blurring){
                this.blur += (this.maxBlur-this.blur)/3;
                if(this.blur > this.maxBlur - .5 ) {
                    this.blurring = false;
                }
            }
            else if(!this.blurring && this.blur>0){
                this.blur -= (this.maxBlur-this.blur)/3;
                if(this.blur < .2){
                    this.blur = 0;
                }
            }

            this.updateColor();

            this.parent();
        },

        updateColor: function(){
            this.color.lightness(this.lightness);
            this.color.alpha(this.alpha);
        },

        pulsate: function(){
            this.size.y = this.size.x;
            var maxRadius = this.maxScale*this.lastIdleSize;
            var scaleAmount = (maxRadius - this.size.x)/5;
            this.size.x += scaleAmount;
            if(maxRadius > this.lastIdleSize){
                if(this.size.x >= maxRadius-.2){
                    this.size.x = maxRadius;
                    this.setState('reverting');
                    this.maxScale = 1.2;
                }
            }
            else {
                if(this.size.x <= maxRadius+.2){
                    this.size.x = maxRadius;
//                    this.setState('reverting');
                }

            }
        },

        darken: function(){

        },

        revert: function(){

            if(this.size.x > this.idleSize){
                var scaleAmount = (this.size.x - this.idleSize)/5;
                this.size.x -= scaleAmount;
                if(this.size.x < this.idleSize+.3){
                    this.size.x = this.idleSize;
                    this.setState('idle');
                }
            }
            else if(this.size.x < this.idleSize){
                var scaleAmount = (this.idleSize - this.size.x)/8;
                this.size.x += scaleAmount;
                if(this.size.x > this.idleSize-.3){
                    this.size.x = this.idleSize;
                    this.setState('idle');
                }
            }
        },

        setState: function(state){
            for(x in this.states){
                this.states[x] = false;
            }
            this.states[state] = true;
        },
        getState: function(){
            for(x in this.states){
                if(this.states[x] == true){
                    return x;
                }
            }
        }
    })
})