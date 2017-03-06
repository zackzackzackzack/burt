var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Command({
  name: "help",
  desc: "does foo things",
  fn: (argv, context) => {
    return `---PLAYBACK COMMANDS---\n
    -burt pls play [episode] [time-frame]:\t Play episode X between time-frames\n
    -burt pls stop:\t Stop current playback\n
    -burt pls pause:\t Pause current playback\n
    -burt pls resume:\t Resume current playback\n
    -burt pls down:\t Turn down volume\n
    -burt pls up:\t Turn up volume\n
    -burt pls min:\t Max volume\n
    -burt pls max:\t Max volume\n\n
    ---LIST COMMANDS---
    -burt list [chapter]:\t List episodes in chapter\n
    -burt list [chapter] lockdown:\ List lockdown episodes`;
  },
  args: []
});
