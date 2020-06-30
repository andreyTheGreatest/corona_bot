const Telegraf = require('telegraf');
const Country = require('./country');
var request = require('request');
var cheerio = require('cheerio');
var db = require('./database');

var URL = 'https://www.worldometers.info/coronavirus/';
var results = [];
let string = '';

function promised() {
  return new Promise((resolve, reject) => {
    request(URL, function (err, res, body) {
      var $ = cheerio.load(res.body);
      var world = new Country("World", ...parseWorld($));
      var ukraine = new Country("Ukraine", ...parseCountry($, 'Ukraine'));
      var germany = new Country("Germany", ...parseCountry($, 'Germany'));
      var russia = new Country("Russia", ...parseCountry($, 'Russia'));
    
      results = new Array(
        world,
        germany,
        ukraine,
        russia
      );
       
      results.forEach(async country => {
        console.log(country);
        db.child("country").child(country.getName).set(country);
        string += country.displayDefault;
      });
      resolve(string);
      
    });
  });
}

function promisedCountry(countryName) {
  var bool = Country.countries.includes(countryName);
  console.log("bool " + bool);
  if (bool) {

    return new Promise((resolve, reject) => {
      request(URL, function (err, res, body) {
        var $ = cheerio.load(res.body);
        const countryVals = parseCountry($, countryName);
        console.log(countryVals)
        let country = new Country(countryName, ...countryVals);
        console.log(country);
        db.child("country").child(countryName).set(country);
        string = country.displaySingleCountryFull;
        resolve(string);
        
      });
    });
  }
  else string = "Provide valid country name!";
}

function parseWorld($) {
  var worldArray = [];
  $('td', '.total_row_world').each(function (i, e) {
    worldArray[i] = $(this).text() == '' ? '0' : $(this).text();
  });
  let index = worldArray.findIndex(x => x === "World") + 2;
  worldArray = worldArray.slice(index, index + 8);
  worldArray.splice(4, 1)
  console.log(worldArray);
  return worldArray;
}

function parseCountry($, countryName) {
  var array = [];
  $('a', 'tbody')
    .filter(function(i, el) {
      return $(this).text() === countryName;
    })
    .first()
    .closest('td')
    .nextAll()
    .each(function (i, e) {
      array[i] = $(this).text() == '' ? '0' : $(this).text();
    });
  console.log(array.splice(5, 1));
  array.splice(8, array.length);
  array.splice(0, 1);
  return array;
} 

// TELEGRAM

const bot = new Telegraf("1114937560:AAEWwk_x9TLJ_qTiGg9P2dakFNA4Gmgq6_0");

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('Response time: %sms', ms)
});

bot.use((ctx, next) => {
    const text = ctx.update.message.text;
    if (text.startsWith('/')) {
      const match = text.match(/^\/([^\s]+)\s?(.+)?/)
      let args = []
      let command
      if (match !== null) {
        if (match[1]) {
          command = match[1]
        }
        if (match[2]) {
          args = match[2].split(' ')
        }
      }
      console.log(args[0]);
      ctx.state.command = {
        raw: text,
        command,
        args
      }
    }
  
  return next()
});

bot.use((ctx, next) => {
  let bool = true;
  db.child("users").child(ctx.message.from.username).once('value', function(ss) {
    var chatID = ss.val();
    console.log(chatID);
    if( chatID !== null ) {
      bool = false;
    }
  })
  if (bool) {
    db.child("users").child(ctx.message.from.username).set({
      chat_id: ctx.message.chat.id
    });
  }
  return next();
});

bot.command('get', async (ctx) => {
  let english = /^[A-Za-z0-9]*$/;
  if (english.test(ctx.state.command.args[0]))
    await promisedCountry(ctx.state.command.args[0]);
  else 
    string = 'Provide only english literals!'
  ctx.telegram.sendMessage(ctx.message.chat.id, string, { parse_mode: "HTML" });
  string = '';
});

bot.command('getall', async (ctx) => {
  await promised();
  ctx.telegram.sendMessage(ctx.message.chat.id, string, { parse_mode: "HTML" });
  string = '';
});

bot.launch();

