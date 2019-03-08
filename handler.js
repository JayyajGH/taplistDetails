'use strict';
const request = require('axios');
const {extractListingsFromHTML} = require('./helpers');

module.exports.gettaplist = (event, context, callback) => {
  if (!event || !event['venueID']) {
    callback(new Error('Invalid venue ID'));
  }

  const venueID = event['venueID'];
  const taplistURL = 'https://taplist.io/taplist-' + encodeURIComponent(venueID);

  request(taplistURL)
    .then(({data}) => {
      const taplistDetails = extractListingsFromHTML(data);
      callback(null, {taplistDetails});
    })
    .catch(function(error) {
      if(error.response.status === 404) {
        callback(new Error('That venue doesn\'t appear to exist'));
      }
      else {
        callback();
      }
    });
};
