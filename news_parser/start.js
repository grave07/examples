// jshint node: true
// jshint unused: true
// jshint esversion: 6

let Parser = {
  results: [],
  content: false,
  fs: require('fs'),
  __parsersCount: 0,
  __parsersCurrent: 0,
  cheerio: require('cheerio'),
  request: require('request'),
  config: function(parsers_config = './parsers.json') {
    return JSON.parse(this.fs.readFileSync(parsers_config, 'utf8'));
  },
  start: function() {
    this.clearResults();
    this.__parsersCount = this.config().length;
    this.__parsersCurrent = 0;
    for (let configItem in this.config()) {
      this.getContent(this.config()[configItem]);
    }
  },
  isDone: function() {
    if (this.__parsersCount === this.__parsersCurrent) {
      return true;
    }
    return false;
  },
  getContent: function(parserData) {
    this.request.get(parserData.url, function(error, response, content) {
      if (!error && response.statusCode == 200) {
        parserData.content = content;
        Parser.parse(parserData);
      } else {
        console.log('Ошибка обработки URL: ' + parserData.url);
      }
    });
  },
  parse: function(parserData) {
    let parser = require(parserData.script);
    console.log('BEGIN: Обрабатываем: ' + parserData.url + ' [' +
      parserData.script + ']');
    if (parser) {
      Parser.results = Parser.results.concat(parser(parserData.content));
    }
    console.log('END: ' + parserData.url);

    this.__parsersCurrent++;
    if (this.isDone()) {
      console.log('Done!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(this.results.length);
      this.showResults();
    }
  },
  clearResults: function() {
    this.results.length = 0;
  },
  showResults: function() {
    this.results.forEach(function(newsItem) {
      console.log(newsItem);
    });
  }
};

Parser.start();
//console.log(Parser.config());
