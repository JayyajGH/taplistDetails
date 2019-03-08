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
      beverageDetails.ABV = getBeverageABVIBUSRM($, beverageStyleAndABV, 'ABV:');
      beverageDetails.IBU = getBeverageABVIBUSRM($, beverageStyleAndABV, 'IBU:');
      beverageDetails.SRM = getBeverageABVIBUSRM($, beverageStyleAndABV, 'SRM:');
      beverageDetails.OG = getBeverageGravity($, beverageStyleAndABV, 'OG:');
      beverageDetails.FG = getBeverageGravity($, beverageStyleAndABV, 'FG:');
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
          (beverageText.substring(0,4) != 'ABV:') &&
          (beverageText.substring(0,4) != 'IBU:') &&
          (beverageText.substring(0,3) != 'OG:') &&
          (beverageText.substring(0,3) != 'FG:') &&
          (beverageText.substring(0,4) != 'SRM:') ) {
        beverageStyle = beverageText.trim();
        return beverageStyle;
      }
    }
  });

  return beverageStyle;
}

function getBeverageABVIBUSRM ($, beverageStyleAndABV, type) {
  let beverageDetails = 'Unknown';

  beverageStyleAndABV.find('li').each((i,el) => {
    if(el) {
      const beverageDetailsText=$(el).text();
      if (beverageDetailsText && (beverageDetailsText.substring(0,4) === type)) {
        beverageDetails = beverageDetailsText.substring(4).trim();
        return beverageDetails;
      }
    }
  });

  return beverageDetails;
}

function getBeverageGravity ($, beverageStyleAndABV, gravityType) {
  let beverageGravity = 'Unknown';

  beverageStyleAndABV.find('li').each((i,el) => {
    if(el) {
      const beverageGravityText=$(el).text();
      if (beverageGravityText && (beverageGravityText.substring(0,3) === gravityType)) {
        beverageGravity = beverageGravityText.substring(4).trim();
        return beverageGravity;
      }
    }
  });

  return beverageGravity;
}

module.exports = {
  extractListingsFromHTML
};
