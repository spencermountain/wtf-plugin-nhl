const wtfNHL = require('./src')
// const wtf = require('wtf_wikipedia')

wtfNHL.fetch('Vancouver Canucks', 2018).catch(console.log).then((obj => {
  console.log(obj.games)
// console.log(JSON.stringify(obj.roster, null, 2))
}))
