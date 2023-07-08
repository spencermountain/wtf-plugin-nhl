> **Heads-up**
> 
> This plugin has moved to → <a href="https://github.com/spencermountain/wtf_wikipedia/tree/master/plugins/sports">wtf_wikipedia/plugins/sports</a>
>
> this repo is now deprecated.

<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-nhl">
    <img src="https://img.shields.io/npm/v/wtf-plugin-nhl.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-person/builds/wtf-plugin-nhl.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-nhl/master/builds/wtf-plugin-nhl.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-nhl</code>
</div>

wtf-nhl gets structured data for nhl hockey teams, supports a bunch of different variants of nhl game log variations, and tries to cleanup some complicated parts of wikipedia sometimes in the wild.

```js
const plugin = require('wtf-plugin-nhl')
wtf.extend(plugin)
wtf.getSeason('Toronto Maple Leafs', 2018).then((data) => {
  console.log(data)
  /*{
  games: [
    { 
      game: 82,
      date: 'April 7 2018',
      opponent: 'Montreal Canadiens',
      result: {
        "us": 4,
        "them": 2
      },
      overtime: false,
      record: {
        "wins": 49,
        "losses": 26,
        "ties": 7,
        "games": 82
      },
      attendance: null,
      points: 105,
      win: true 
    },
    ...
  ],
  roster: [
    {
      "name": "Ron Hainsey",
      "games": 80,
      "goals": 4,
      "assists": 19,
      "points": 23,
      "plusMinus": 12
    },
    ...
  ],
}*/
})
```

<div align="center">
  <h2><a href="https://observablehq.com/@spencermountain/wtf-plugin-nhl">Demo</a></h2>
</div>

### See also:

- [wtf-mlb](https://github.com/spencermountain/wtf-mlb)

MIT
