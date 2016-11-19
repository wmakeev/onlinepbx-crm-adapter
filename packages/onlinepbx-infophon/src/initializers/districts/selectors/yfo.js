module.exports = scraper => scraper
  .find('tr:nth-child(6)')
  .set({
    phones: ['td:first-child > ol > li'],
    districts: ['td:nth-child(2) > a']
  })
