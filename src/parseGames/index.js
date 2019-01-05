const addWinner = require('./win-loss')
const dashSplit = /(–|-|−|&ndash;)/

const parseRecord = function(record = '') {
  let arr = record.split(dashSplit)
  let result = {
    wins: Number(arr[0]) || 0,
    losses: Number(arr[2]) || 0,
    ties: Number(arr[4]) || 0
  }
  result.games = result.wins + result.losses + result.ties
  return result
}

const parseScore = function(score = '') {
  let arr = score.split(dashSplit)
  if (!arr[0] && !arr[2]) {
    return {}
  }
  return {
    win: Number(arr[0]),
    loss: Number(arr[2])
  }
}

const isFuture = function(games) {
  games.forEach((g) => {
    if (!g.attendance && !g.points) {
      if (!g.record.wins && !g.record.lossess && !g.record.ties) {
        g.inFuture = true
        g.win = null
      }
    }
  })
  return games
}

const parseDate = function(row, title) {
  let year = title.year
  let date = row.date || row.Date
  if (!date) {
    return ''
  }
  //the next year, add one to the year
  if (/^(jan|feb|mar|apr)/i.test(date)) {
    date += ' ' + (year + 1)
  } else {
    date += ' ' + year
  }
  return date
}

const parseGame = function(row, title) {
  let attendance = row.attendance || ''
  attendance = Number(attendance.replace(/,/, '')) || null
  let res = {
    game: Number(row['#'] || row.Game),
    date: parseDate(row, title),
    opponent: row.Opponent,
    result: parseScore(row.score || row.Score),
    overtime: (row.ot || row.OT || '').toLowerCase() === 'ot',
    // goalie: row.decision,
    record: parseRecord(row.record || row.Record),
    attendance: attendance,
    points: Number(row.pts || row.points || row.Pts || row.Points) || 0
  }
  if (!res.opponent) {
    res.location = row.Location
    res.home = row.home || row.Home
    res.visitor = row.visitor || row.Visitor
  }
  return res
}

//
const parseGames = function(doc, title) {
  let games = []
  let s = doc.sections('regular season') || doc.sections('schedule and results')
  if (!s) {
    return games
  }
  //do all subsections, too
  let tables = s.tables()
  s.children().forEach(c => {
    tables = tables.concat(c.tables())
  })
  if (!tables[0]) {
    return games
  }
  tables.forEach((table) => {
    let rows = table.keyValue()
    rows.forEach(row => {
      games.push(parseGame(row, title))
    })
  })
  games = games.filter((g) => g && g.date)
  games = addWinner(games)
  games = isFuture(games)
  return games
}
module.exports = parseGames
