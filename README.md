<div align="center">

  <div>pull NHL team data from wikipedia</div>
  <div><img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" /></div>

  <div align="center">
    <a href="https://npmjs.org/package/wtf-mlb">
      <img src="https://img.shields.io/npm/v/wtf-mlb.svg?style=flat-square" />
    </a>
    <a href="https://codecov.io/gh/spencermountain/wtf-mlb">
      <img src="https://codecov.io/gh/spencermountain/wtf-mlb/branch/master/graph/badge.svg" />
    </a>
    <a href="https://unpkg.com/wtf-mlb/builds/wtf-mlb.min.js">
      <img src="https://badge-size.herokuapp.com/spencermountain/wtf-mlb/master/builds/wtf-mlb.min.js" />
    </a>
  </div>

  <sub>
    by
    <a href="https://spencermountain.github.io/">Spencer Kelly</a> and
    <a href="https://github.com/spencermountain/wtf-mlb/graphs/contributors">
      contributors
    </a>
  </sub>
</div>
<p></p>

<div align="center">
  <code>npm install wtf-nhl</code>
</div>

wtf-nhl is a wrapper of [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia/) that supports a bunch of different variants of nhl game log variations, that are used sometimes in the wild.

```js
wtfNHL.fetch('Toronto Blue Jays', 2018).then(console.log)
//[{
//   date: 'April 1',
//   team: 'Reds',
//   home: false,
//   result: { us: 6, them: 5, win: true },
//   record: { wins: 3, losses: 0, games: 3
// },
//  ....


//or if you already have the doc,
var json = wtfNHL.parse(doc)
```

to do a bunch of years in a row:
```js
wtfNHL.history('St. Louis Cardinals', 1992, 1997).catch(console.log).then(data => {
  data = data.map((obj) => {
    //grab just the date and attendance
    obj.games = obj.games.map((g) => [g.date, g.attendance])
    return obj
  })
  console.log(JSON.stringify(data, null, 2))
})
```

### See also:
* [wtf-mlb](https://github.com/spencermountain/wtf-mlb)

(work-in-progress)

MIT
