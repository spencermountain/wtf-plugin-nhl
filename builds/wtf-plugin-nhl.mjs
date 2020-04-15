/* wtf-plugin-nhl 2.0.0  MIT */
var teams = ['Boston Bruins', 'Buffalo Sabres', 'Detroit Red Wings', 'Florida Panthers', 'Montreal Canadiens', 'Ottawa Senators', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 'Carolina Hurricanes', 'Columbus Blue Jackets', 'New Jersey Devils', 'New York Islanders', 'New York Rangers', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'Washington Capitals', 'Chicago Blackhawks', 'Colorado Avalanche', 'Dallas Stars', 'Minnesota Wild', 'Nashville Predators', 'St. Louis Blues', 'Winnipeg Jets', 'Anaheim Ducks', 'Arizona Coyotes', 'Calgary Flames', 'Edmonton Oilers', 'Los Angeles Kings', 'San Jose Sharks', 'Vancouver Canucks', 'Vegas Golden Knights'];

//amazingly, it's not clear who won the game, without the css styling.
//try to pull-it out based on the team's record
var addWinner = function addWinner(games) {
  var wins = 0;
  games.forEach(function (g) {
    if (g.record.wins > wins) {
      g.win = true;
      wins = g.record.wins;
    } else if (g.record.wins === wins) {
      g.win = null;
    } else {
      g.win = false;
    } //improve the result format, now that we know who won..


    var res = g.result;

    if (g.win) {
      g.result = {
        us: res.win,
        them: res.loss
      };
    } else {
      g.result = {
        us: res.loss,
        them: res.win
      };
    }
  });
  return games;
};

var winLoss = addWinner;

var dashSplit = /(–|-|−|&ndash;)/;

var parseRecord = function parseRecord() {
  var record = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var arr = record.split(dashSplit);
  var result = {
    wins: Number(arr[0]) || 0,
    losses: Number(arr[2]) || 0,
    ties: Number(arr[4]) || 0
  };
  result.games = result.wins + result.losses + result.ties;
  return result;
};

var _record = parseRecord;

var dashSplit$1 = /(–|-|−|&ndash;)/;

var parseScore = function parseScore() {
  var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var arr = score.split(dashSplit$1);

  if (!arr[0] && !arr[2]) {
    return {};
  }

  return {
    win: Number(arr[0]),
    loss: Number(arr[2])
  };
};

var isFuture = function isFuture(games) {
  games.forEach(function (g) {
    if (!g.attendance && !g.points) {
      if (!g.record.wins && !g.record.lossess && !g.record.ties) {
        g.inFuture = true;
        g.win = null;
      }
    }
  });
  return games;
};

var parseDate = function parseDate(row, title) {
  var year = title.year;
  var date = row.date || row.Date;

  if (!date) {
    return '';
  } //the next year, add one to the year


  if (/^(jan|feb|mar|apr)/i.test(date)) {
    date += ' ' + (year + 1);
  } else {
    date += ' ' + year;
  }

  return date;
};

var parseGame = function parseGame(row, title) {
  var attendance = row.attendance || '';
  attendance = Number(attendance.replace(/,/, '')) || null;
  var res = {
    game: Number(row['#'] || row.Game),
    date: parseDate(row, title),
    opponent: row.Opponent,
    result: parseScore(row.score || row.Score),
    overtime: (row.ot || row.OT || '').toLowerCase() === 'ot',
    // goalie: row.decision,
    record: _record(row.record || row.Record),
    attendance: attendance,
    points: Number(row.pts || row.points || row.Pts || row.Points) || 0
  };

  if (!res.opponent) {
    res.location = row.Location;
    res.home = row.home || row.Home;
    res.visitor = row.visitor || row.Visitor;
  }

  return res;
}; //


var parseGames = function parseGames(doc, title) {
  var games = [];
  var s = doc.sections('regular season') || doc.sections('schedule and results');

  if (!s) {
    return games;
  } //do all subsections, too


  var tables = s.tables();
  s.children().forEach(function (c) {
    tables = tables.concat(c.tables());
  });

  if (!tables[0]) {
    return games;
  }

  tables.forEach(function (table) {
    var rows = table.keyValue();
    rows.forEach(function (row) {
      games.push(parseGame(row, title));
    });
  });
  games = games.filter(function (g) {
    return g && g.date;
  });
  games = winLoss(games);
  games = isFuture(games);
  return games;
};

var parseGames_1 = parseGames;

var ordinal = /([0-9])(st|nd|rd|th)$/i;

var toCardinal = function toCardinal() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  str = str.trim();

  if (ordinal.test(str)) {
    str = str.replace(ordinal, '$1');
    return Number(str);
  }

  if (/^[0-9]+$/.test(str)) {
    return Number(str);
  }

  return str;
}; //


var parseInfobox = function parseInfobox(doc) {
  var info = doc.infobox('ice hockey team season')[0] || doc.infobox('NHLTeamSeason')[0];

  if (!info) {
    return {};
  }

  var data = info.keyValue();
  Object.keys(data).forEach(function (k) {
    data[k] = toCardinal(data[k]);
  });

  if (data.record) {
    data.record = _record(data.record);
  }

  return data;
};

var infobox = parseInfobox;

var parseTitle = function parseTitle() {
  var season = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var num = season.match(/[0-9]+/) || [];
  var year = Number(num[0]) || season;
  var team = season.replace(/[0-9\-–]+/, '').replace(/_/g, ' ').replace(' season', '');
  return {
    year: year,
    season: season,
    team: team.trim()
  };
};

var parseRoster = function parseRoster(doc) {
  var s = doc.sections('skaters') || doc.sections('roster') || doc.sections('player statistics');
  var players = [];

  if (!s) {
    return players;
  } //do all subsections, too


  var tables = s.tables();
  s.children().forEach(function (c) {
    tables = tables.concat(c.tables());
  });

  if (!tables[0]) {
    return players;
  }

  players = tables[0].keyValue().map(function (o) {
    var name = o.Player || '';
    name = name.replace(/\(.*?\)/, '');
    name = name.replace(/[‡†]/, '');
    name = name.trim();
    return {
      name: name,
      games: Number(o.GP || 0),
      goals: Number(o.G || 0),
      assists: Number(o.A || 0),
      points: Number(o.Pts || o.PTS || o.Points) || 0,
      plusMinus: Number(o['+/−']) || 0
    };
  });
  players = players.filter(function (o) {
    return o && o.name && o.name !== 'Total';
  });
  return players;
}; //


var parse = function parse(doc) {
  var res = {
    title: parseTitle(doc.title()),
    roster: parseRoster(doc),
    season: infobox(doc)
  };
  res.games = parseGames_1(doc, res.title);
  return res;
};

var parse_1 = parse;

var makePage = function makePage(team, year) {
  team = team.replace(/ /g, '_');
  year = year || new Date().getFullYear();
  var nextYear = Number(String(year).substr(2, 4)) + 1;
  var page = "".concat(year, "\u2013").concat(nextYear, "_").concat(team, "_season"); //2018–19_Toronto_Maple_Leafs_season

  return page;
};

var addMethod = function addMethod(models) {
  models.wtf.getSeason = function (team, year) {
    //soften-up the team-input
    team = teams.find(function (t) {
      return t === team || t.toLowerCase().includes(team.toLowerCase());
    }) || team;
    var page = makePage(team, year);
    return models.wtf.fetch(page)["catch"](console.log).then(parse_1);
  };
};

var src = addMethod;

export default src;
