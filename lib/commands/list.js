var Clapp = require('../modules/clapp-discord');
var _ = require('lodash');

module.exports = new Clapp.Command({
  name: "list",
  desc: "list episodes",
  fn: (argv, context) => {
    var episodes = require('../../episodes.json');

    if(argv.args.series !== 'first') {
      episodes = _.filter(episodes, (episode) => {
        return _.includes(episode.title.toLowerCase(), argv.args.series);
      })

      episodes = _.map(episodes, (episode, idx) => {
        return `[${idx + 1}]\t` + episode.title;
      });

      episodes = _.chunk(episodes, 1);
    } else {
      episodes = _.filter(episodes, (episode) => {
        return !_.includes(episode.title.toLowerCase(), 'lockdown');
      })

      episodes = _.map(episodes, (episode, idx) => {
        return `[${idx + 1}]\t` + episode.title;
      });

      episodes = _.chunk(episodes, 3);
    }

    var chunk = episodes[argv.args.eps - 1];

    var message = chunk && chunk.length > 0 ? episodes[argv.args.eps - 1].join('\n') : 'I can\'t find this shit';

    return message;
  },
  args: [
    {
      name: 'eps',
      desc: 'Number to list',
      type: 'number',
      required: false,
      default: 1
    },
    {
      name: 'series',
      desc: 'Series to list',
      type: 'string',
      required: false,
      default: 'first'
    },
  ]
});
