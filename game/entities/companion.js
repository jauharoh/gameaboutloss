ig.module(
    'game.entities.companion'
)

.requires(
    'impact.entity',
    'game.entities.character',
    'game.entities.aura'
)


.defines(function() {
        EntityCompanion = EntityCharacter.extend({
            color: null,
            rgba: 'rgba(0,0,255,1)',
            shakeMax: 2,
            shakeCount: 0,
            shakeDir: 1,
            shakeMult: 10,
            shakeVal: null,
            shakeSlow: 1,
            shakeTimer: null,
            rotation: 0,
            rotationMax: 16,
            rotationVel: 0,
            cueShake: false,
            hidden: false,

            //Shape coordinates
            points: [],
            auraPoints: [],

            init: function(x,y,settings){
                this.parent(x,y,settings)
                this.lightness = 85
                this.color.saturation(100);
                this.color.lightness(this.lightness);
            },

            setShade: function(){
                this.color.lightness(50-this.rotation/2);
                this.color.saturation(80-this.rotation/2);

            },


            push: function(){
                this.states.pushing = true;
            },

            disapprove: function(){
                if(this.size.x != this.idleSize){
                    this.setState('reverting')
                }
                this.cueShake = true;

                this.rotationVel = 1;
                this.shakeCount = 0;
                this.shakeTimer = new ig.Timer();

            },

            colorRotate: function(deg){
                this.color.rotate(deg)
            },

            ding: function(){

            },

            drawShape: function(){
                var ctx = ig.system.context;
                var radius = (this.size.y)*this.scale;
                ctx.save();
                this.color.rgb(this.rgb);
                this.color.alpha(this.alpha);
                ctx.fillStyle = this.color.rgbString();

                //Define top left coords
                //Define top right coords
                //Define bottom coords

                ctx.beginPath();
                this.drawPath(ctx, radius, this.screenX, this.screenY, this.scale);

                //Move to top left
                this.drawShadow(ctx);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            },

            drawPath: function(ctx, radius, x, y, s){
                var height = Math.sqrt( Math.pow(radius,2) - Math.pow((radius/2), 2) );
                var width = this.size.x*s;
                var topLeft = this.points[0] = {x: x - width/2, y: y - height/2 };
                var topRight = this.points[1] = {x: x + width/2, y: y - height/2};
                var bottom = this.points[2] = {x: x, y: y + height/2};
                ctx.moveTo(topLeft.x, topLeft.y);
                //Draw to top right
                ctx.lineTo(topRight.x, topRight.y);
                //Draw to bottom
                ctx.lineTo(bottom.x, bottom.y);
            },

            drawAura: function(){
                var ctx = ig.system.context;
                ctx.beginPath();
                ctx.moveTo(this.auraPoints[0].x, this.auraPoints[0].y);
                ctx.lineTo(this.auraPoints[1].x, this.auraPoints[1].y);
                ctx.lineTo(this.auraPoints[2].x, this.auraPoints[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();

                this.auraPoints[0].x -= 1;
                this.auraPoints[0].y -= 1;
                this.auraPoints[1].x += 1;
                this.auraPoints[1].y -= 1;
                this.auraPoints[2].y += 1;


            },

            triggerAura: function(accuracy){
                this.parent();
                var points = []
                for(x in this.points){
                    var arr = {x: this.points[x].x, y: this.points[x].y - 2000};
                    points.push(arr);
                }
                var offset = 40;
                var posY = -this.pos.y;
                ig.game.spawnEntity(EntityAura, this.pos.x, posY, {offset: 20,accuracy: accuracy, points: points, rgba: this.color.rgbaString()})
//                if(accuracy > .8){
//                    ig.game.spawnEntity(EntityAura, this.pos.x, posY, {offset: 20+ offset, accuracy: accuracy, points: points, rgba: this.color.rgbaString()})
//
//                    if(accuracy > .9){
//                        ig.game.spawnEntity(EntityAura, this.pos.x, posY, {offset: 20+offset*2, accuracy: accuracy, points: points, rgba: this.color.rgbaString()})
//
//
//                    }
//                }
            },


            shake:function(){
                var shakeVal = this.idleSize - (5+(this.shakeTimer.delta()*this.shakeMult));
                if(this.shakeDir == 1){
                    var scaleFactor = (this.size.x - shakeVal)/5;
                    this.size.x -= scaleFactor;

                }
                else if(this.shakeDir == -1){
                    var scaleFactor = (this.idleSize - shakeVal)/8;
                    this.size.x += scaleFactor;
                }
                if(this.size.x < shakeVal+1){
                    this.shakeDir = -this.shakeDir;
                }
                else if(this.size.x > this.idleSize -1){
                    this.shakeDir = -this.shakeDir;
                }
                if(this.shakeTimer.delta()>1){
                    this.states.shaking = false;
                    this.states.reverting = true;
                    this.shakeTimer = null;
                }
            },

            rotate: function(){
                var diff = this.rotationMax*this.rotationVel - this.rotation;
                if(Math.abs(diff)> 10){
                    this.rotation += this.rotationVel*2;
                }
                else {
                    this.rotation += diff/8;
                }
                if(this.rotationVel > 0){
                    if(this.rotation >= this.rotationMax - 3){
                        this.rotationVel = -this.rotationVel;
                        this.rotation = this.rotationMax;
                        this.shakeCount++;
                    }
                }
                else {
                    if(this.rotation <= -this.rotationMax + 3){
                        this.rotationVel = -this.rotationVel;
                        this.rotation = -this.rotationMax;
                        this.shakeCount++
                    }
                };
                if(this.shakeCount == this.shakeMax){
                    this.setState('reverting');

                }
                this.size.x = this.idleSize - Math.abs(this.rotation);
            },

            release: function(){
                this.lastIdleSize = this.idleSize;
                this.states.releasing = true;
            },

            pulsate: function(){
              this.parent();
            },

            revert: function(){
              if(this.size.y != this.idleSize){
                  this.size.y = this.size.x;
              }
              this.parent();
              if(this.cueShake && this.states.idle){
                  this.setState('shaking');
                  this.cueShake = false;
              }
                if(this.size.y > this.idleSize - .4 && this.size.y < this.idleSize + .4){
                    this.size.y = this.idleSize;
                }
              this.rotation = -this.rotationVel*(this.idleSize - this.size.x);
            },

            update: function(){
                this.parent();
//                if(this.states.shaking && this.states.reverting == false){
//                    this.rotate();
//                }

                if(this.states.reverting || this.states.shaking){
//                    this.setShade();
                }

//                if(ig.input.pressed('tap')){
//                    this.triggerAura();
//                }
            },
            elate: function(accuracy){
                this.triggerAura(accuracy);
            }

        })
    })