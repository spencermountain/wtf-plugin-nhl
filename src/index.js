const wtf = require('wtf_wikipedia')
const teams = require('./teams')
const parse = require('./parse')
const version = require('../_version')

const makePage = function(team, year) {
  team = team.replace(/ /g, '_')
  year = year || new Date().getFullYear()
  let nextYear = Number(String(year).substr(2, 4)) + 1
  let page = `${year}–${nextYear}_${team}_season` //2018–19_Toronto_Maple_Leafs_season
  return page
}

//who cares.
const wtfMLB = {

  fetch: function(team, year) {
    //soften-up the team-input
    team = teams.find(t => {
        return t === team || t.toLowerCase().includes(team.toLowerCase())
      }) || team;
    let page = makePage(team, year)
    return wtf.fetch(page).catch(console.log).then(parse)
  },

  history: function(team, from, to) {
    //soften-up the team-input
    team = teams.find(t => {
        return t === team || t.toLowerCase().includes(team.toLowerCase())
      }) || team;
    let pages = []
    for (let i = from; i <= to; i += 1) {
      pages.push(makePage(team, i))
    }
    return wtf.fetch(pages).catch(console.log).then((docs) => {
      docs = typeof docs.map !== 'function' ? [docs] : docs
      return docs.map(parse)
    })
  },

  parse: (wiki) => {
    var doc = wtf(wiki)
    return parse(doc)
  },
  //this is handy
  version: version

}
module.exports = wtfMLB
