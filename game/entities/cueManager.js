ig.module(
    'game.entities.cueManager'
)

.requires(
    'impact.entity',
    'game.entities.cue',
    'game.entities.vignette',
    'color'
)

.defines(function(){
    EntityCueManager = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255,0,0, .6)',
        size: {x:20,y:20},
        nextCue: null,
        tweetIndex: 1,
        targetBackgroundRGB: [233,111,200],
        currentBackgroundRGB: [255,255,255],
        cues: [],
        cueTypes: [
            'background',
            'vignette',
            'player',
            'companion',
            'phase'
        ],

        init: function(x,y,settings){
            this.parent(x,y,settings);
            this.resetCues();
            this.color = new EntityColor('rgb(255,255,255)');
        },

        resetCues: function(){
            this.bakeCues();
            this.setNextCue();
            for(var i = 0; i< this.cueTypes.length; i++){
                this.setCues(this.cueTypes[i])
            }
            debug("resetCues")
        },

        update: function(){
            currentTime = ig.music.currentTrack.currentTime;
            if(currentTime > this.nextCue.time && ig.music.isPlaying()){
                if(this.cues.phaseLast.name == "upwardTurn" && !this.nextCue.used ){
                    if(this.tweetIndex < ig.game.data.tweets.length){
                        ig.game.manager.addTweet(ig.game.data.tweets[this.tweetIndex]);
                        this.tweetIndex += 1;
                    }

                }
                ig.game.companion.release();
                this.nextCue.used = true;
            }
            if(currentTime > this.nextCue.time + .2){
                this.setNextCue();
            }
            for(var i =0; i<this.cueTypes.length; i++){
                var mode = this.cueTypes[i];
                if(mode != 'phase'){
                    this.updateElement(mode);
                }
                if(currentTime > this.cues[mode + "Next"].time){
                    this.setCues(mode)
                }
            }
//            this.updateBackground();
//            this.updateVignette();
        },
        /**
         * take Cues collection and creates an object containing all cues
         */
        fetchCues: function(mode){
            if(typeof mode != 'undefined'){
                var cues = ig.game.manager.levelCurrent.cues.filter(function(val){
                    return val.mode == mode;
                })
            }

            return cues;
        },
        bakeCues: function(){
            var cues = ig.game.manager.levelCurrent.cues.filter(function(val){
                return val.mode == "tempo";
            });
            if(cues.length){
                cues.sort(function(a,b){ return parseFloat(a.time) - parseFloat(b.time)});
                bakedCues = [];
                for(var i =0; i<cues.length; i += 1){
                    if(cues[i].tempo != 0){
                        var repeat = 0;
                        var p = parseFloat(i);
                        var bpm = 60/cues[p].tempo;
                        var cue = cues[p];
                        var next = cues[p+1]
                        if(next && next.hasOwnProperty('time')){
                            repeat = Math.floor((next.time - cue.time)/bpm)
                        }
                        else {
                            repeat = Math.floor((ig.music.currentTrack.duration - cue.time)/bpm)
                        }
                        for(var x = 0; x< repeat+2; x += 1){
                            bakedTime = cue.time + (bpm * x)
                            bakedCues.push({time: parseFloat(bakedTime)})
                        }
                    }
                }
            }
            this.bakedCues = bakedCues;
        },
        /**
         * iterates through cue objects
         */
        setNextCue: function(){
            cues = this.bakedCues;
            if(cues.length){
                cues.sort(function(a,b) { return parseFloat(a.time) - parseFloat(b.time) } );
                if(ig.music.currentTrack.currentTime < cues[0].time){
                    this.nextCue = cues[0]
                }
                else{
                    for(var i in cues){
                        if(cues[i].hasOwnProperty('time')){
                            var n = parseFloat(i)+1;
                            if(cues[n]){
                                if(ig.music.currentTrack.currentTime >= cues[i].time && ig.music.currentTrack.currentTime < cues[n].time){
                                    this.nextCue = cues[n];
                                }
                            }
                        }
                    }
                }
            }
        },

        setCues: function(mode){
            var cues = ig.game.manager.levelCurrent.cues.filter(function(val){
                return val.mode == mode;
            });
            if(cues.length == 0){
                this.cues[mode+"Last"] = {time:0, rgb: "000000", width: 500, radius: 500, blur: 400, opacity: 0};
                this.cues[mode+"Next"] = {time: ig.music.currentTrack.duration, rgb: "000000", width: 500, radius: 500, blur: 400, opacity: 0};

            }
            else{
                cues.sort(function(a,b){ return parseFloat(a.time) - parseFloat(b.time)});
                if(ig.music.currentTrack.currentTime  <= cues[0].time){
                    last = {}
                    for(key in cues[0]){
                        last[key] = cues[0][key]
                    }
                    if(mode === "phase"){
                        last.loop = "false"
                    }
                    last.time = -1;
                    this.cues[mode+"Last"] = last;
                    this.cues[mode+"Next"] = cues[0];
                }
                else if(ig.music.currentTrack.currentTime >= cues[cues.length-1].time){
                    last = cues[cues.length-1];
                    next = {};
                    for(key in last){
                        next[key] = last[key]
                    }
                    next.time = 10000;
                    this.cues[mode+"Next"] = next;
                    this.cues[mode+"Last"] = last;
                }
                else {
                    for (var i = 0; i<cues.length; i += 1){
                        var n = parseFloat(i)+1;
                        if(cues[n]){
                            if(ig.music.currentTrack.currentTime >= cues[i].time && ig.music.currentTrack.currentTime < cues[n].time){
                                this.cues[mode+"Last"] = cues[i];
                                this.cues[mode+"Next"] = cues[n];
                            }
                        }
                    }
                }
            }
        },

        updateElement: function(mode){
            var next =  this.cues[mode+'Next'];
            var last = this.cues[mode+'Last'];
            var relativePos = (ig.music.currentTrack.currentTime - last.time)/(next.time - last.time);
            for(key in next){
                if(key == 'rgb'){
                    var value = this.interpolateRGB(last, next, relativePos);
                }
                else {
                    var value = parseFloat(parseFloat(last[key]) + (parseFloat(next[key]) - parseFloat(last[key]))*relativePos);
                    if(mode == "vignette" && key == "alpha"){
                    }
                }
                if(!ig.game[mode].override || key === "maxAlpha"){
                    ig.game[mode][key] = value;
                }
            }
        },

        interpolateRGB: function(last, next, pos){
            var i = -1;
            nextRGB = this.hex2rgb(next.rgb);
            lastRGB = this.hex2rgb(last.rgb);
            var rgbDif = nextRGB.map(function(x){
                i++;
                return x - lastRGB[i]
            });
            i = -1;
            var rgb = rgbDif.map(function(x){
                i++;
                return lastRGB[i] +x*pos;
            });
            return rgb
        },

        updateBackground: function(){
            //Find position between last cue and next cue
            var next = this.cues.backgroundNext;
            var last = this.cues.backgroundLast;
            var relativePos = (ig.music.currentTrack.currentTime - last.time)/ (next.time - last.time)
            var nextRGB = this.hex2rgb(next.rgb);
            var lastRGB = this.hex2rgb(last.rgb);
            var i = -1;
            var rgbDif = nextRGB.map(function(x){
                i++;
                return x - lastRGB[i]
            });
            i = -1;
            var rgb = rgbDif.map(function(x){
                i++;
                return lastRGB[i] +x*relativePos;
            })
            this.color.rgb(rgb[0], rgb[1], rgb[2]);
//            $('body').css('background', this.color.hexString())
            ig.game.clearColor = this.color.rgbString();
//            this.currentBackgroundRGB = rgb;


        },

        hex2rgb: function(hex){
            function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
            r = parseInt((cutHex(hex)).substring(0,2),16);
            g = parseInt((cutHex(hex)).substring(2,4),16);
            b = parseInt((cutHex(hex)).substring(4,6),16);
            return [r,g,b]

        }

    })
})