// jshint node: true
// jshint unused: true
// jshint esversion: 6
module.exports = (html) => {
    "use strict";

    let returnResults = [];
    let cheerio = require('cheerio');
    let parser = cheerio.load(html, {
        decodeEntities: false,
        xmlMode: true,
    });

    parser('item').each(function(index, value) {
        let newsItem = {
            name: parser(value).find('title').html(),
            date: parser(value).find('pubDate').html(),
            content: parser(value).find('description').html(),
            url: parser(value).find('guid').html(),
        };
        returnResults.push(newsItem);
    });

    /*
    parser('div[id*="news:item"]').each(function (index, value) {
        let newsItem = {
            name: parser(value).find('.news__list__item__link__text').html(),
            data: parser(value).find('.news__list__item__description').html(),
            url: parser(value).find('a').attr('href'),
        };
        returnResults.push(newsItem);
    });
    */
    return returnResults;
};
