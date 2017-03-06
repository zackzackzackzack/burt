var Clapp = require('../modules/clapp-discord');
var request = require('request');
var fs = require('fs');
const ytdl = require('ytdl-core');
const _ = require('lodash');

module.exports = new Clapp.Command({
  name: "pls",
  desc: "plays a story",
  fn: (argv, context) => {
    var bot = context.bot;
    var voiceChannel = null;

    for (var channel of bot.channels) {
      if(channel[1].name === 'We\'re Alive' && channel[1].type === 'voice') {
        voiceChannel = channel[1];
        break;
      }
    }

    var options = {};

    var time = -1;
    if (argv.args.playtime && argv.args.playtime !== '-1') {
      const timeline = argv.args.playtime.split('-');
      const start = timeline[0];
      const end = timeline[1];
      time = end - start;

      options = {
        seek: start
      };
    }

    var message = '';

    switch (argv.args.command) {
      case 'play':
        message = playSound(voiceChannel, argv.args.episode, options, time);
        break;
      case 'stop':
        message = stopSound(voiceChannel);
        break;
      case 'pause':
        message = pauseSound(voiceChannel);
        break;
      case 'resume':
        message = resumeSound(voiceChannel);
        break;
      case 'down':
        message = lowerVolume(voiceChannel);
        break;
      case 'up':
        message = increaseVolume(voiceChannel);
        break;
      case 'min':
        message = minVolume(voiceChannel);
        break;
      case 'max':
        message = maxVolume(voiceChannel);
        break;
      default:
        message = 'Mary had a little lamb, little lamb...'
        break;
    }

    return message;
  },
  args: [
    {
      name: 'command',
      desc: 'The command',
      type: 'string',
      required: true,
      default: 'command isn\'t defined'
    },
    {
      name: 'episode',
      desc: 'The episode index',
      required: false,
      type: 'number',
      default: 1
    },
    {
      name: 'playtime',
      desc: 'Play options',
      type: 'string',
      required: false,
      default: '-1'
    }
  ]
});

var dispatcher = null;

function playSound(voiceChannel, episode, options, time) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher) {
      dispatcher.end();
      dispatcher = null;
    }

    var episodes = require('../../episodes.json');

    episodes = _.filter(episodes, (episode) => {
      return !_.includes(episode.title.toLowerCase(), 'lockdown');
    });

    var ep = request(episodes[episode - 1].url);
    dispatcher = connection.playStream(ep, options);
    dispatcher.setVolume(2);

    dispatcher.on('end', () => {
      dispatcher = null;
    });

    dispatcher.on('start', () => {
      if(time !== -1) {
        setTimeout(() => {
          stopSound(voiceChannel)
        }, 1000 * time);
      }
    });

    return `Listen Up!\t ${episodes[episode - 1].title}`;

    // connection.playFile(sound).then(function(intent, playError) {
    //   if(playError) {
    //     var playErrorMessage = 'Error playing sound file: ';
    //     console.log(playErrorMessage, playError);
    //     bot.sendMessage(authorChannel, playErrorMessage + playError);
    //   }
    //   intent.on('error', function(streamError) {
    //     var streamErrorMessage = 'Error streaming sound file: ';
    //     console.log(streamErrorMessage, streamError);
    //     bot.sendMessage(authorChannel, streamErrorMessage + streamError);
    //   });
    // });
  });
}

function stopSound(voiceChannel) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher) {
      dispatcher.end();
      dispatcher = null;
      return 'Stopped playing!';
    }

    return 'I\'m not playing right now.';
  })
}

function pauseSound(voiceChannel) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher) {
      dispatcher.pause();
      return 'Alright... Time-out';
    }

    return 'I\'m not playing right now.';
  })
}

function resumeSound(voiceChannel) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher && dispatcher.paused) {
      dispatcher.resume();
      return 'We begin again...';
    }

    return 'I\'m not playing right now.';
  })
}

function lowerVolume(voiceChannel) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher) {
      var reduced = dispatcher.volume - 0.25;
      if(reduced > 0) {
        dispatcher.setVolume(reduced);
        return `Shhhhhhhhhh\t Volume: ${dispatcher.volume}`;
      } else {
        return 'I can\'t speak any quieter...';
      }
    }

    return 'I\'m not playing right now.';
  })
}

function increaseVolume(voiceChannel) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher) {
      var increased = dispatcher.volume + 0.25;
      if(increased <= 2) {
        dispatcher.setVolume(increased);
        return `ALRIGHT!\t Volume: ${dispatcher.volume}`;
      } else {
        return 'I CAN\'T SPEAK ANY LOUDER OLD FOGIE...';
      }
    }

    return 'I\'m not playing right now.';
  })
}

function minVolume(voiceChannel) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher) {
      dispatcher.setVolume(0.25);
      return 'I\'ll be as quiet as possible.';
    }

    return 'I\'m not playing right now.';
  })
}

function maxVolume(voiceChannel) {
  return voiceChannel.join().then(function(connection, joinError) {
    if(joinError) {
      var joinErrorMessage = 'Error joining voice channel: ';
      return joinErrorMessage + joinError;
    }

    if(dispatcher) {
      dispatcher.setVolume(2);
      return 'I\'ll be as LOUD as possible.';
    }

    return 'I\'m not playing right now.';
  })
}
