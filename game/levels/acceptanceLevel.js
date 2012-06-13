ig.module('game.levels.acceptanceLevel')       
.defines(function(){            
    AcceptanceLevel ={    
        'cues':            
                [
    {
        "mode": "tempo",
        "time": 0,
        "index": 0,
        "rgb": "000000",
        "bpm": 60,
        "phase": 0,
        "tempo": 70,
        "alpha": 0,
        "radius": 500,
        "width": 500,
        "blur": 500,
        "position": 0
    },
    {
        "mode": "player",
        "time": "0",
        "index": 1,
        "rgb": "00FF22",
        "bpm": 70,
        "opacity": 1,
        "phase": 0,
        "position": 0,
        "alpha": "0",
        "posX": "0",
        "posY": "00",
        "idleSize": 60
    },
    {
        "mode": "companion",
        "time": "0",
        "index": 2,
        "rgb": "FF0000",
        "bpm": 70,
        "opacity": 1,
        "phase": 0,
        "position": 0,
        "alpha": "0",
        "posX": 490,
        "posY": -330,
        "idleSize": 200,
        "maxAlpha": "0",
        "maxScale": 1.3
    },
    {
        "mode": "vignette",
        "time": "0",
        "index": 3,
        "rgb": "FFFFFF",
        "tempo": 70,
        "opacity": 1,
        "position": 0,
        "alpha": 1,
        "radius": 500,
        "width": 500,
        "blur": 500
    },
    {
        "mode": "tempo",
        "time": 5.25,
        "index": 4,
        "rgb": "000000",
        "tempo": 35,
        "opacity": 1,
        "position": 24
    },
    {
        "mode": "background",
        "time": "0",
        "index": 5,
        "rgb": "FFFFFF",
        "tempo": 70,
        "opacity": 1,
        "position": 0,
        "alpha": 1,
        "segmentType": "end",
        "triggerType": "score"
    },
    {
        "mode": "tempo",
        "time": 39.25,
        "rgb": "000000",
        "tempo": 35.37,
        "opacity": 1,
        "index": 6,
        "position": 180
    },
    {
        "mode": "phase",
        "time": "0",
        "rgb": "000000",
        "tempo": 70,
        "opacity": 1,
        "index": 7,
        "position": 0,
        "name": "loop1",
        "loop": "false",
        "triggerType": "score",
        "triggerValue": 1
    },
    {
        "mode": "phase",
        "time": 27.27,
        "rgb": "000000",
        "tempo": 70,
        "opacity": 1,
        "index": 8,
        "position": 125,
        "name": "loop2",
        "loop": "false",
        "triggerType": "score",
        "triggerValue": 1
    },
    {
        "mode": "phase",
        "time": 41.24,
        "rgb": "000000",
        "tempo": 70,
        "opacity": 1,
        "index": 9,
        "position": 189,
        "name": "loop3",
        "loop": "false",
        "triggerType": "score",
        "triggerValue": 1
    },
    {
        "mode": "phase",
        "time": 53.23,
        "rgb": "000000",
        "tempo": 70,
        "opacity": 1,
        "index": 10,
        "position": 244,
        "name": "loop4",
        "loop": "false",
        "triggerType": "score",
        "triggerValue": 1
    },
    {
        "mode": "phase",
        "time": 136.35,
        "rgb": "000000",
        "tempo": 70,
        "opacity": 1,
        "index": 11,
        "position": 625,
        "name": "end",
        "loop": "false",
        "triggerType": "score",
        "triggerValue": 1
    },
    {
        "mode": "phase",
        "time": 75.05,
        "rgb": "000000",
        "tempo": 70,
        "opacity": 1,
        "index": 12,
        "position": 344,
        "name": "endLoops",
        "loop": "false",
        "triggerType": "score",
        "triggerValue": 1
    },
    {
        "mode": "companion",
        "time": 27.27,
        "rgb": "0000FF",
        "tempo": 70,
        "opacity": 1,
        "index": 13,
        "position": 125,
        "alpha": "0",
        "maxAlpha": "0",
        "posX": 490,
        "posY": -330,
        "idleSize": 200,
        "maxScale": 1.3
    },
    {
        "mode": "companion",
        "time": 41.23,
        "rgb": "33FF00",
        "tempo": 70,
        "opacity": 1,
        "index": 14,
        "position": 189,
        "alpha": "0",
        "maxAlpha": "0",
        "posX": 490,
        "posY": -330,
        "idleSize": 200,
        "maxScale": 1.3
    },
    {
        "mode": "companion",
        "time": 53.23,
        "rgb": "F700FF",
        "tempo": 70,
        "opacity": 1,
        "index": 15,
        "position": 244,
        "alpha": "0",
        "maxAlpha": "0",
        "posX": 490,
        "posY": -330,
        "idleSize": 200,
        "maxScale": 1.3
    },
    {
        "mode": "player",
        "time": 5.44,
        "index": 16,
        "rgb": "00FF22",
        "bpm": 70,
        "opacity": 1,
        "phase": 0,
        "position": 25,
        "alpha": 0.9,
        "posX": "0",
        "posY": "00",
        "idleSize": 60
    },
    {
        "mode": "background",
        "time": 75.05,
        "index": 17,
        "rgb": "F8FF91",
        "tempo": 70,
        "opacity": 1,
        "position": 344,
        "alpha": 0.95,
        "segmentType": "end",
        "triggerType": "score"
    },
    {
        "mode": "vignette",
        "time": 27,
        "index": 18,
        "rgb": "FFF780",
        "tempo": 70,
        "opacity": 1,
        "position": 124,
        "alpha": 0.48,
        "radius": 500,
        "width": 500,
        "blur": 500
    },
    {
        "mode": "vignette",
        "time": 75.05,
        "index": 19,
        "rgb": "FFD814",
        "tempo": 70,
        "opacity": 1,
        "position": 344,
        "alpha": 0.89,
        "radius": 500,
        "width": 500,
        "blur": 500
    },
    {
        "mode": "player",
        "time": 75.05,
        "rgb": "FFB914",
        "tempo": 70,
        "opacity": 1,
        "index": 20,
        "position": 344,
        "alpha": 0.95,
        "posX": "0",
        "posY": "00",
        "idleSize": 60
    },
    {
        "mode": "player",
        "time": 41.23,
        "rgb": "00FF22",
        "tempo": 70,
        "opacity": 1,
        "index": 21,
        "position": 189,
        "alpha": 0.9,
        "posX": "0",
        "posY": "00",
        "idleSize": 60
    },
    {
        "mode": "background",
        "time": 26.96,
        "rgb": "FFFFFF",
        "tempo": 70,
        "opacity": 1,
        "index": 22,
        "position": 124,
        "alpha": 1
    },
    {
        "mode": "vignette",
        "time": 109,
        "index": 23,
        "rgb": "FF870F",
        "tempo": 70,
        "opacity": 1,
        "position": 500,
        "alpha": 0.89,
        "radius": 500,
        "width": 500,
        "blur": 500
    },
    {
        "mode": "vignette",
        "time": 140,
        "index": 24,
        "rgb": "FFFFFF",
        "tempo": 70,
        "opacity": 1,
        "position": 642,
        "alpha": 0.89,
        "radius": 500,
        "width": 500,
        "blur": 500
    },
    {
        "mode": "background",
        "time": 140,
        "index": 25,
        "rgb": "F8FF91",
        "tempo": 70,
        "opacity": 1,
        "position": 642,
        "alpha": 0.95,
        "segmentType": "end",
        "triggerType": "score"
    },
    {
        "mode": "background",
        "time": 154,
        "index": 26,
        "rgb": "FFFFFF",
        "tempo": 70,
        "opacity": 1,
        "position": 706,
        "alpha": 0.95,
        "segmentType": "end",
        "triggerType": "score"
    }
]         
                        
             }              
         }                  
    )                       
                