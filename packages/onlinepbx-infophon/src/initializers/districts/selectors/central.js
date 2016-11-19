module.exports = scraper => scraper
  .find('#search_resoult')
  .set({
    phones: ['ol > li'],
    districts: ['div > a']
  })
