module.exports = scraper => scraper
  .find('.resoults')
  .set({
    phones: ['ol > li'],
    districts: ['+ td > a']
  })
