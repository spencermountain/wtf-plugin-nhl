// const wtfNHL = require('./src')
const wtf = require('wtf_wikipedia')
wtf.extend(require('./src'))
wtf
  .getSeason('Toronto Maple leafs', 2017)
  .catch(console.log)
  .then((obj) => {
    // console.log(Object.keys(obj))
    console.log(JSON.stringify(obj.games, null, 2))
  })

// wtfNHL.history('Toronto Maple Leafs', 1964, 2018).catch(console.log).then((docs => {
//   let years = []
//   docs.map((obj) => {
//     let season = obj.season
//     let league = season.leaguerank || season.Leaguerank || season.LeagueRank || null
//     let division = season.divisionrank || season.Divisionrank || season.DivisionRank || null
//     years.push([obj.title.year, league, division])
//   })
//   console.log(years)
// }))
