const wtfNHL = require('./src')
// const wtf = require('wtf_wikipedia')

// wtfNHL.fetch('Montreal Canadiens', 1966, 1974).catch(console.log).then((obj => {
//   console.log(obj.title.season, obj.season)
// // console.log(JSON.stringify(obj.roster, null, 2))
// }))

wtfNHL.history('Toronto Maple Leafs', 1942, 1972).catch(console.log).then((docs => {
  let years = []
  docs.map((obj) => {
    let season = obj.season
    let league = season.leaguerank || season.Leaguerank || season.LeagueRank || null
    let division = season.divisionrank || season.Divisionrank || season.DivisionRank || null
    years.push([obj.title.year, league, division])
  })
  console.log(years)
}))
