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
       
      results.forEach(country => {
        db.child("country").child(country.getName).once('value', (ss) => {
          let oldCountry = ss.val();
          console.log(oldCountry);
          country.residuals(oldCountry.new_cases, oldCountry.total_deaths, oldCountry.new_deaths, oldCountry.total_recovered, oldCountry.active_cases);
        })
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
        db.child("country").child(countryName).once('value', (ss) => {
          let oldCountry = ss.val();
          console.log(oldCountry);
          country.residuals(oldCountry.new_cases, oldCountry.total_deaths, oldCountry.new_deaths, oldCountry.total_recovered, oldCountry.active_cases);
        })
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
  worldArray.splice(0, 93);
  worldArray.splice(5, 195);
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
  array.splice(6, array.length);
  array.splice(0, 1);
  return array;
} 

// TELEGRAM

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

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

