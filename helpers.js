const cheerio = require('cheerio');

function extractListingsFromHTML (html) {
  const $ = cheerio.load(html);

  const taplistDetails = {};
  const beverageList = [];

  // Get the venue
  taplistDetails.venue = $('.font-primary').text().trim();

  // Loop through each beverage and scrape the details
  const taplistRows = $('table tbody tr');

  taplistRows.each((i, el) => {
    beverageList.push(returnBeverageDetails($, el));
  });

  taplistDetails.beverageList = beverageList;

  return taplistDetails;
}

function returnBeverageDetails ($, el) {
  let beverageDetails = {};

  const beverageDetailsElement = $(el).find('.font-secondary');
  if (beverageDetailsElement) {
    const beverageNameAndBreweryElement = beverageDetailsElement.find('h4');
    if (beverageNameAndBreweryElement) {
      beverageDetails.breweryName = getBreweryName(beverageNameAndBreweryElement);
      beverageDetails.beverageName = getBeverageName(beverageNameAndBreweryElement);
    }

    const beverageStyleAndABV = beverageDetailsElement.find('ul');
    if (beverageStyleAndABV) {
      beverageDetails.beverageStyle = getBeverageStyle($, beverageStyleAndABV);
      beverageDetails.ABV = getBeverageABV($, beverageStyleAndABV);
    }
  }

  return beverageDetails;
}

function getBreweryName (beverageNameAndBreweryElement) {
  let breweryName = 'Unknown';

  const breweryNameElement = beverageNameAndBreweryElement.find('small');
  if (breweryNameElement) {
    breweryName = breweryNameElement.text().substring(3).trim();
  }

  return breweryName;
}

function getBeverageName (beverageNameAndBreweryElement) {
  let beverageName = 'Unknown';

  let overallName = beverageNameAndBreweryElement.html();
  if (overallName) {
    var pos = overallName.indexOf('<small>');
    beverageName = overallName.substring(3, pos).trim();
  }

  return beverageName;
}

function getBeverageStyle ($, beverageStyleAndABV) {
  let beverageStyle = 'Unknown';

  const beverageStyleElement = beverageStyleAndABV.find('li').get(0);
  if (beverageStyleElement) {
    beverageStyle = $(beverageStyleElement).text().trim();
  }

  return beverageStyle;
}

function getBeverageABV ($, beverageStyleAndABV) {
  let beverageABV = 'Unknown';

  beverageStyleAndABV.find('li').each((i,el) => {
    if(el) {
      const beverageABVText=$(el).text();
      if (beverageABVText && (beverageABVText.substring(0,3) === 'ABV')) {
        beverageABV = beverageABVText.substring(4).trim();
        return beverageABV;
      }
    }
  });

  return beverageABV;
}

module.exports = {
  extractListingsFromHTML
};
