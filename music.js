
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var setAudio = function(file, callback) {
    const request = new XMLHttpRequest();
    request.open("GET", file, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            audioContext.decodeAudioData(request.response, callback);
        }
    };
    request.send();
};

var musicBuffers = {};
var activeMusic = [];
var musicMuted = false;
if (window.localStorage.getItem("musicMuted") == "true") {
    musicMuted = true;
}
else if (window.localStorage.getItem("musicMuted") == undefined) {
    window.localStorage.setItem("musicMuted", musicMuted);
}
var musicVolume = audioContext.createGain();
musicVolume.connect(audioContext.destination);
musicVolume.gain.setValueAtTime(1, audioContext.currentTime);
var playMusic = function(id) {
    stopAllMusic();
    if (musicBuffers[id]) {
        var gain = audioContext.createGain();
        var source = audioContext.createBufferSource();
        activeMusic.push({
            source: source,
            gain: gain,
        });
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.connect(musicVolume);
        source.buffer = musicBuffers[id];
        source.loop = true;
        source.connect(gain);
        source.start();
        gain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 1);
        return true;
    }
    return false;
};
var stopAllMusic = function() {
    for (let i in activeMusic) {
        activeMusic[i].gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        setTimeout(function() {
            activeMusic[i].source.stop();
        }, 1000);
    }
};
var toggleMusic = function() {
    musicMuted = !musicMuted;
    if (musicMuted) {
        musicVolume.gain.setValueAtTime(0, audioContext.currentTime);
    }
    else {
        musicVolume.gain.setValueAtTime(1, audioContext.currentTime);
    }
    window.localStorage.setItem("musicMuted", musicMuted);
};
var effects = {};
var updateEffects = function() {
    for (var i in effects) {
        if (effects[i].activated) {
            effects[i].play();
            effects[i].activated = false;
        }
    }
};
setAudio("./music/explosion.mp3", function(buffer) {
    effects.explosion = {
        preloadQueue: [],
        play: function() {
            this.preloadQueue.shift().start();
            var nextSource = audioContext.createBufferSource();
            nextSource.buffer = buffer;
            nextSource.connect(audioContext.destination);
            this.preloadQueue.push(nextSource);
        },
    };
    effects.explosion.preloadQueue.push(audioContext.createBufferSource());
    effects.explosion.preloadQueue[0].buffer = buffer;
    effects.explosion.preloadQueue[0].connect(audioContext.destination);
});
setAudio("./music/monsterDeath.mp3", function(buffer) {
    effects.monsterDeath = {
        preloadQueue: [],
        play: function() {
            this.preloadQueue.shift().start();
            var nextSource = audioContext.createBufferSource();
            nextSource.buffer = buffer;
            nextSource.connect(audioContext.destination);
            this.preloadQueue.push(nextSource);
        },
    };
    effects.monsterDeath.preloadQueue.push(audioContext.createBufferSource());
    effects.monsterDeath.preloadQueue[0].buffer = buffer;
    effects.monsterDeath.preloadQueue[0].connect(audioContext.destination);
});
setAudio("./music/goal.mp3", function(buffer) {
    effects.goal = {
        preloadQueue: [],
        play: function() {
            this.preloadQueue.shift().start();
            var nextSource = audioContext.createBufferSource();
            nextSource.buffer = buffer;
            nextSource.connect(audioContext.destination);
            this.preloadQueue.push(nextSource);
        },
    };
    effects.goal.preloadQueue.push(audioContext.createBufferSource());
    effects.goal.preloadQueue[0].buffer = buffer;
    effects.goal.preloadQueue[0].connect(audioContext.destination);
});
setAudio("./music/win.mp3", function(buffer) {
    effects.win = {
        preloadQueue: [],
        play: function() {
            this.preloadQueue.shift().start();
            var nextSource = audioContext.createBufferSource();
            nextSource.buffer = buffer;
            nextSource.connect(audioContext.destination);
            this.preloadQueue.push(nextSource);
        },
    };
    effects.win.preloadQueue.push(audioContext.createBufferSource());
    effects.win.preloadQueue[0].buffer = buffer;
    effects.win.preloadQueue[0].connect(audioContext.destination);
});
effects.oscillator = {
    preloadQueue: [],
    increase: function(i, j) {
        this.preloadQueue[i][j].activated += 1;
    },
    decrease: function(i, j) {
        this.preloadQueue[i][j].activated -= 1;
    },
    play: function(i, j) {
        this.preloadQueue[i][j].oscillator.start(audioContext.currentTime);
        this.preloadQueue[i][j].playing = true;
    },
    stop: function(i, j) {
        var stoppingOscillator = this.preloadQueue[i][j].oscillator;
        // setTimeout(function() {
        stoppingOscillator.stop(audioContext.currentTime);
        // }, 250);
        this.preloadQueue[i][j].playing = false;
        var oscillator = audioContext.createOscillator();
        oscillator.frequency.value = oscillatorHz[j];
        if (i <= 0) {
            oscillator.type = "square";
        }
        else if (i <= 1) {
            oscillator.type = "triangle";
        }
        else if (i <= 2) {
            oscillator.type = "sawtooth";
        }
        else if (i <= 3) {
            oscillator.type = "sine";
        }
        else {
            var wave = audioContext.createPeriodicWave(oscillatorWaves[i][0], oscillatorWaves[i][1], { disableNormalization: true });
            oscillator.setPeriodicWave(wave);
        }
        var gain = audioContext.createGain();
        gain.gain.value = 0;
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        this.preloadQueue[i][j] = { oscillator: oscillator, gain: gain, activated: 0, lastActivated: 0, playing: false };
    },
    update: function() {
        for (var i in oscillatorWaves) {
            for (var j in oscillatorHz) {
                if (!this.preloadQueue[i][j].playing && this.preloadQueue[i][j].activated > 0) {
                    this.play(i, j);
                }
                if (this.preloadQueue[i][j].playing && this.preloadQueue[i][j].activated == 0) {
                    this.stop(i, j);
                }
                if (this.preloadQueue[i][j].activated != this.preloadQueue[i][j].lastActivated) {
                    this.preloadQueue[i][j].gain.gain.value = this.preloadQueue[i][j].activated * 0.1;
                    this.preloadQueue[i][j].lastActivated = this.preloadQueue[i][j].activated;
                }
                this.preloadQueue[i][j].activated = 0;
            }
        }
    },
    reset: function() {
        for (var i in oscillatorWaves) {
            for (var j in oscillatorHz) {
                this.preloadQueue[i][j].activated = 0;
            }
        }
    },
};

var oscillatorWaves = [[], [], [], [], [[0, 1, 1, 1, 0], [0, 0.25, 0.25, 0.75, 1]]];
// var oscillatorWaves = [[], [], [], [], [], [], [[0, 1, 1, 1, 0], [0, 0.25, 0.25, 0.75, 1]], [[0, 1], [0, 1]]];
// var oscillatorLengths = [0.25, 0.75, 0.25, 0.75, 0.25, 0.75, 0.25];
var oscillatorHz = [220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.50, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760.00];
for (var i in oscillatorWaves) {
    effects.oscillator.preloadQueue[i] = [];
    for (var j in oscillatorHz) {
        var oscillator = audioContext.createOscillator();
        oscillator.frequency.value = oscillatorHz[j];
        if (i <= 0) {
            oscillator.type = "square";
        }
        else if (i <= 1) {
            oscillator.type = "triangle";
        }
        else if (i <= 2) {
            oscillator.type = "sawtooth";
        }
        else if (i <= 3) {
            oscillator.type = "sine";
        }
        else {
            var wave = audioContext.createPeriodicWave(oscillatorWaves[i][0], oscillatorWaves[i][1], { disableNormalization: true });
            oscillator.setPeriodicWave(wave);
        }
        var gain = audioContext.createGain();
        gain.gain.value = 0;
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        effects.oscillator.preloadQueue[i][j] = { oscillator: oscillator, gain: gain, activated: 0, lastActivated: 0, playing: false };
    }
}
for (let i = 1; i <= 12; i++) {
    setAudio(`./music/drum${i}.mp3`, function(buffer) {
        effects[`drum${i}`] = {
            preloadQueue: [],
            play: function() {
                this.preloadQueue.shift().start();
                var nextSource = audioContext.createBufferSource();
                nextSource.buffer = buffer;
                nextSource.connect(audioContext.destination);
                this.preloadQueue.push(nextSource);
            },
        };
        effects[`drum${i}`].preloadQueue.push(audioContext.createBufferSource());
        effects[`drum${i}`].preloadQueue[0].buffer = buffer;
        effects[`drum${i}`].preloadQueue[0].connect(audioContext.destination);
    });
}

var stopAllOscillators = function() {
    for (var i in oscillatorWaves) {
        for (var j in oscillatorHz) {
            effects.oscillator.stop(i, j);
        }
    }
};