const wtfNHL = require('./src')
// const wtf = require('wtf_wikipedia')

wtfNHL.fetch('Toronto Maple Leafs', 2018).catch(console.log).then((obj => {
  console.log(obj)
// console.log(JSON.stringify(obj.roster, null, 2))
}))
