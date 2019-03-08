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
      beverageDetails.ABV = getBeverageInfo($, beverageStyleAndABV, 'ABV:');
      beverageDetails.IBU = getBeverageInfo($, beverageStyleAndABV, 'IBU:');
      beverageDetails.SRM = getBeverageInfo($, beverageStyleAndABV, 'SRM:');
      beverageDetails.OG = getBeverageInfo($, beverageStyleAndABV, 'OG:');
      beverageDetails.FG = getBeverageInfo($, beverageStyleAndABV, 'FG:');
    }

    const beverageDescription = beverageDetailsElement.find('p');
    if (beverageDescription) {
      beverageDetails.description = beverageDescription.text();
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

  beverageStyleAndABV.find('li').each((i,el) => {
    if(el) {
      const beverageText=$(el).text();
      if (beverageText &&
          (!beverageText.startsWith('ABV:')) &&
          (!beverageText.startsWith('IBU:')) &&
          (!beverageText.startsWith('OG:')) &&
          (!beverageText.startsWith('FG:')) &&
          (!beverageText.startsWith('SRM:'))) {
        beverageStyle = beverageText.trim();
        return beverageStyle;
      }
    }
  });

  return beverageStyle;
}

function getBeverageInfo ($, beverageStyleAndABV, type) {
  let beverageDetails = 'Unknown';

  beverageStyleAndABV.find('li').each((i,el) => {
    if(el) {
      const beverageDetailsText=$(el).text();
      if (beverageDetailsText && (beverageDetailsText.startsWith(type))) {
        beverageDetails = beverageDetailsText.substring(type.length).trim();
        return beverageDetails;
      }
    }
  });

  return beverageDetails;
}

module.exports = {
  extractListingsFromHTML
};
