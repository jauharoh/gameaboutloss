ig.module(
    'game.entities.manager'
)

.requires(
    'impact.entity',
    'game.entities.circle',
    'game.looper',
    'game.levels.comp',
    'game.levels.unityLevel',
    'game.levels.lossLevel',
    'game.levels.acceptanceLevel'
//    'game.levels.acceptanceLevel',
//    'game.levels.angerLevel',
//    'game.levels.denialLevel',
//    'game.levels.disharmonyLevel',
//    'game.levels.harmonyLevel',
//    'game.levels.introductionLevel',
//    'game.levels.isolationLevel',
//    'game.levels.depressionLevel',
//    'game.levels.endOfDepressionLevel',
//    'game.levels.reconstructionLevel',
//    'game.levels.upwardTurnLevel'
)

.defines(function(){
        Tweet = Backbone.Model.extend({
            initialize: function(model, options){
            }
        })

        Tweets = Backbone.Collection.extend({
            initialize: function(models, options){
                this.bind("add", options.addCue);
//                this.bind("destroy", options.view.removeCue);
            }
        })

        TweetFormView = Backbone.View.extend({
            events: {
            },
            initialize: function(){
                _.bindAll();
                this.render();
                this.initEl();

            },
            render: function(){
                this.el = ich.tweetFormView();
                return this;
            },
            initEl: function(){
                this.el.css({'top': window.height/2, 'left': window.width/2})
                this.el.submit(this.submit);
                this.el.hide();
            },
            show: function(){
                this.el.fadeIn(2000);
            },

            hide: function(){
                this.el.fadeOut(2000);
            },


            submit: function(e){
                e.preventDefault();
                console.log(e.target)
                var baseURL = 'http://twitter.com/home?status=';
                var atUser = "@humming_way+";
                var hashtag = "#gameaboutloss"
                var messageText = $(e.target).find('.text').val() + ' ' + hashtag;
                var tweetURL = baseURL + atUser + encodeURIComponent(messageText);
                console.log(tweetURL);
                window.open(tweetURL);
                $(this).fadeOut();
                return false;
            }

        })
        TweetView = Backbone.View.extend({
            elements: {},
            events: {

            },
            initialize: function(){
                _.bindAll(this);
                this.render();
                this.initEl();
    //            $(this.el).find("#time_input").unbind('input');
            },

            hide: function(){
            },

            initEl: function(){
                var randomLeft = (Math.random()*window.width)*.6;
                var randomTop = (Math.random()*window.height)*.6;
                this.el.css('left', randomLeft).css('top', randomTop);
                this.el.addClass('blurred');
            },

            show: function(){
                this.el.css({'text-shadow': '0 0 0px black', 'box-shadow': '0px 200px 0px white'}).delay(1500).fadeOut(2000);
            },

            render: function(){
                console.log(this.model);
                this.el = ich.tweetView(this.model);
                return this;
            }
        })

        EntityManager = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(0,0,255, .6)',
            size:{x:30, y:30},
            hits: 0,
            misses: 0,
            hitThreshold: .3,
            dingSFX: new ig.Sound('media/ding.*'),
            failSFX: new ig.Sound('media/wrong.*'),
            denialSounds: [
                new ig.Sound('media/thump_1.*')
            ],
            isolationSounds: [
                new ig.Sound('media/scratch_1.*'),
                new ig.Sound('media/scratch_2.*'),
                ],
            angerSounds: [
                new ig.Sound('media/shatter_1.*')
            ],
            drumBassSFX: new ig.Sound('media/drum_base_1.*'),
            drumSFX: new ig.Sound('media/drum_1.*'),
            clapSFX: new ig.Sound('media/clap_1.*'),
            offset: 0,
            maxVolume: .4,
            phaseOffset: .2,

            tweetTimes: [
                170,
                175,
                180
            ],
            loops: [
                {width: 4, sound:'drumSFX'},
                {width: 6, sound:'drumBassSFX'},
                {width: 2, sound:'clapSFX'},
                {width: 3, sound:'dingSFX'},
                ],
            tweetCues: [],
            tweetViews: [],
            loopers: [],
            showTweet: false,

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.levels = Comp.levels;
                for(var i = 0; i<this.levels.length; i += 1){
                    this.levels[i]['cues'] = window[this.levels[i].name + 'Level'].cues;
                    this.levels[i]['index'] = i;
                }
                this.levelCurrent = this.levels[0];
                this.dingSFX = new ig.Sound('media/ding.*');
                this.dingSFX.volume = .5;
                this.level = {passed: false};
                this.fetchTweets();
                for(var i = 0; i<this.loops.length; i += 1){
                    this.loopers.push(new Looper(0,0, {'sfx': this[this.loops[i].sound], 'width': this.loops[i].width}));
                }

                for(var i = 0; i<this.tweetTimes.length; i += 1){
                   this.tweetCues.push({time: this.tweetTimes[i], shown: false})
                }
            },

            update: function(){

                if(ig.game.cueManager){
                    var phaseLast = ig.game.cueManager.cues.phaseLast;
                    var phaseNext = ig.game.cueManager.cues.phaseNext;
                    var fadeOut = 1;
                    this.updatePhase(phaseLast.name);
                    if(phaseNext.time - ig.music.currentTrack.currentTime < fadeOut){
                        this.checkTrigger();
                        if(!this.level.passed){
                            if(phaseLast.loop == 'true'){
                                ig.music.volume = ((phaseNext.time - ig.music.currentTrack.currentTime)/fadeOut)*this.maxVolume;
                            }
                        }
                    }
                    else{
                        if(ig.music.volume < this.maxVolume){
                            ig.music.volume += .01;
                        }
                    }
                    if(ig.music.currentTrack.currentTime > phaseNext.time){
                        if(phaseLast.loop == "true") {
                            if(this.level.passed){
                                this.level.passed = false;
                            }
                            else{
                                this.repeat();
                            }
                        }
                    }

                }
                //Call level specific function
                //Check for music-level sync
                if(ig.music.currentIndex > this.levelCurrent.index){
                    this.levelNext();
                }
                else if(ig.music.currentIndex < this.levelCurrent.index){
                    this.levelPrevious();
                }

            },

            updatePhase: function(phase){

                ig.game.background.override = false;
                ig.game.companion.override = false;
                ig.game.player.override = false;
                ig.game.vignette.override = false;

                switch(phase){
                    case "harmony1":
                        this.loopers[0].record();
                        break;
                    case "harmony2":
                        this.loopers[1].record();
                        this.loopers[0].play()
                        break;
                    case "harmony3":
                        this.loopers[2].record();
                        this.loopers[1].play()
                        break;
                    case "harmony4":
                        this.loopers[3].record();
                        this.loopers[2].play()
                        break;
                    case "disharmony":
                        if(!this.harmonyEnd){
                            for(var i = 0; i<this.loopers.length; i += 1){
                                this.loopers[i].stop();
                            }
                            this.harmonyEnd = true;
                        }
                        break;

                    case "denial":
                        ig.game.companion.override = true;
                        for(var i = 0; i<this.tweetCues.length; i += 1){
                            if(ig.music.currentTrack.currentTime > this.tweetCues[i].time && this.tweetCues[i].shown == false){
                                this.addTweet(ig.game.data.tweets[i]);
                                this.tweetCues[i].shown = true;
                            }
                        }
                        if(ig.game.companion.alpha < 0){
                            ig.game.companion.alpha = 0
                        }
                        else{
                            ig.game.companion.alpha -= .0035;
                        }
                        break;
                    case "anger":
                        ig.game.player.override = true;
                        ig.game.background.override = true;
                        ig.game.vignette.override = true;
                        break;
                    case "isolation":
                        ig.game.vignette.override = true;
                        ig.game.background.override = true;
                        var rgb = [];
                        var currentRgb = ig.game.hex2rgb(ig.game.cueManager.cues.backgroundLast.rgb)
                        for(var i = 0; i< 3; i += 1){
                           rgb.push((currentRgb[i] - ig.game.background.rgb[i])/10)
                        }
                        for(var i = 0; i<3; i += 1){
                            ig.game.background.rgb[i] += rgb[i]
                        }
                        if(ig.game.vignette.alpha <= ig.game.cueManager.cues.vignetteLast.alpha){
                            ig.game.vignette.alpha = ig.game.cueManager.cues.vignetteLast.alpha
                        }
                        else {
                            ig.game.vignette.alpha -= (ig.game.vignette.alpha-ig.game.cueManager.cues.vignetteLast.alpha)/10
                        }
                        break;
                    case "outreach":
                        if(ig.game.data.tweets.length > 0 && !ig.game.data.tweets[0].shown){
                            this.addTweet(ig.game.data.tweets[0])
                        }
//                        for(var i = 0; i<this.tweetCues.length; i += 1){
//                            if(ig.music.currentTrack.currentTime > this.tweetCues[i].time && this.tweetCues[i].shown == false){ this.addTweet(ig.game.data.tweets[i]);
//                                this.tweetCues[i].shown = true;
//                            }
//                        }
                        break;
                    case "upwardTurn":
                        if(this.tweetNow){
                            if(ig.game.data.tweets.length > 0){
                                var tweet = ig.game.data.tweets[ig.game.cueManager.tweetIndex];
                                if(!tweet.shown){
                                    this.addTweet(tweet);
                                }
                            }
                        }
                       break;
                    case "loop1":
                        this.loopers[0].record();
                        break;

                    case "loop2":
                        this.loopers[1].record();
                        this.loopers[0].play();
                        break;

                    case "loop3":
                        this.loopers[2].record();
                        this.loopers[1].play();
                        break;

                    case "loop4":
                        this.loopers[3].record();
                        this.loopers[2].play();
                        break;

                    case "endLoops":
                        this.loopers[3].play();
                        break;

                    case "end":
                        if(!this.ending){
                            this.addTweetForm();
                            this.ending = true;
                            ig.music.loop = false;
                        }
                        else {

                            if(!this.ended && !ig.music.isPlaying()){
                                this.ended = true;
                            }
                        }
                        if(ig.music.currentTrack.currentTime > ig.music.currentTrack.duration-.5){
                            ig.music.stop();
                        }
                }
            },

            addLooper: function(index, sfx){
                this.loopers[index] = new Looper(0,0, {'sfx': sfx});
            },

            addTweet: function(tweet){
                var text = tweet.text.replace('@humming_way', '');
                text = text.replace('#gameaboutloss', '');
                tweet.text = text;
                var tweetModel = new Tweet(tweet);
                var tweetView = new TweetView({model: tweetModel});
                this.tweetViews.push(tweetView);
                var view = $(tweetView.el).appendTo('body').hide().fadeIn(2000);
                this.showTweet = true;
                tweet.shown = true;
                this.tweet = view;

            },

            addTweetForm: function(){
                var view = new TweetFormView();
                $('body').append(view.el);
                view.show();
            },


            checkTrigger: function(){
                var triggerType = ig.game.cueManager.cues.phaseLast.triggerType;
                var triggerValue = ig.game.cueManager.cues.phaseLast.triggerValue;
                if(ig.game[triggerType] >= triggerValue){
                    this.level.passed = true;
                    ig.game[triggerType]=0;
                }
            },


            repeat: function(){
                ig.game.score = 0;
                ig.music.currentTrack.currentTime = ig.game.cueManager.cues.phaseLast.time;
                ig.game.cueManager.resetCues();
            },

            fetchTweets: function(){
                $.ajax({
                    dataType: 'jsonp',
                    url: "http://search.twitter.com/search.json?q=%40humming_way%20%23gameaboutloss",
                    crossDomain: true,
                    success: function(data){ ig.game.data.tweets = data.results}})
            },
            checkTiming: function(){
                if(ig.game.companion.getState() == 'idle'){
                    //                    ig.game.companion.disapprove();
                }
                delta = ig.music.currentTrack.currentTime;
                var currentCue = ig.game.cueManager.nextCue;
                var diff = Math.abs(delta-(currentCue.time+this.offset));
                var accuracy = (this.hitThreshold - diff)/this.hitThreshold;
                if( ig.game.companion.blur == 0 && accuracy > .5 ){
                    //                    ig.game.companion.maxScale = 1 + accuracy/2;
                    return accuracy;
                }
                else {
                    return false;
                }
            },

            submit: function(){
                ig.game.player.pulse();
                switch(ig.game.cueManager.cues.phaseLast.name){
                    case "introduction":
                    case "harmony1":
                    case "harmony2":
                    case "harmony3":
                    case "harmony4":
                        var accuracy = this.checkTiming();
                        if(accuracy){
                            ig.game.companion.blurring = false;
                            ig.game.companion.elate(accuracy);
                            this.dingSFX.volume = accuracy;
                            this.looper.recordBeat();
                            ig.game.score += 1;
                        }
                        else{
                            this.failSFX.play();
                            ig.game.companion.blurring = true;

                        }
                        break;

                    case "loop1":
                    case "loop2":
                    case "loop3":
                    case "loop4":
                        this.looper.recordBeat();
                        var color = new Color();
                        color.rgb();
                        color.alpha(.6);
                        ig.game.spawnEntity(EntityCircle, ig.game.player.screenX, ig.game.player.screenY-2000, {radius: ig.game.player.size.x, rgb: ig.game.cueManager.hex2rgb(ig.game.cueManager.cues.companionLast.rgb)})
                        break;


                    default:
                        this.checkTiming();
                        break;

                    case "denial":
                        var accuracy = this.checkTiming();
                        if(accuracy){
                            this.randomItem(this.denialSounds).play();
                            var alpha = ig.game.companion.alpha;
                            if(ig.game.companion.maxAlpha != 0){
                                if(alpha > ig.game.companion.maxAlpha){
                                    alpha = ig.game.companion.maxAlpha;
                                }
                                else {

                                   ig.game.companion.alpha += (1 - ig.game.companion.alpha)/8;
                                }
                            }
                        }
                        else{
                            ig.game.companion.blurring = true;

                        }
                        break;
                    case "anger":
                        ig.game.background.rgb = this.randomRGB();
                        ig.game.player.rgb = this.randomRGB();
                        ig.game.vignette.rgb = this.randomRGB();
                        this.randomItem(this.angerSounds).play()
                        break;
                    case "isolation":
                        ig.game.background.rgb = ig.game.cueManager.hex2rgb(ig.game.cueManager.cues.backgroundNext.rgb);
                        ig.game.cueManager.hex2rgb(ig.game.cueManager.cues.backgroundNext.rgb);
                        ig.game.vignette.rgb = [0,0,0];
                        ig.game.vignette.alpha = 1;
                        this.randomItem(this.isolationSounds).play();
                        break;
                    case "outreach":
                    case "upwardTurn":
                        ig.game.score = 10;
                        if(this.tweetViews[0]){
                        this.tweetViews[0].show();
                        this.tweetViews.splice(0,1)
                        }
                        break;
                }
            },

            randomItem: function(array){
                var i = Math.floor(Math.random()*(array.length));
                return array[i]
            },

            randomRGB: function(){
                var rgb = [parseInt(Math.random()*255), parseInt(Math.random()*255), parseInt(Math.random()*255)];
                return rgb;
            },

            levelNext: function(){
//                ig.music.next();
                this.levelCurrent = this.levels[this.levelCurrent.index + 1];
                ig.game.cueManager.resetCues();
                ig.game.editor.view.addAll();
                ig.game.editor.view.reloadCues();
                this.level.passed = false;
                ig.game.score = 0;
            },

            levelPrevious: function(){
                if(this.levelCurrent != 0){
                    this.levelCurrent = this.levels[this.levelCurrent.index - 1];
                    ig.game.cueManager.resetCues();
                    ig.game.editor.view.addAll();
                    ig.game.editor.view.reloadCues();
                    ig.game.score = 0;
                    }
            },

            indexCues: function(){
              for(var i = 0; i<this.levelCurrent.cues.length; i += 1){
                  this.levelCurrent.cues[i].index = i;
              }
            }

        })
    })