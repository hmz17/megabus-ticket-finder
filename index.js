// Makes some route calls
/*jshint esversion: 6 */

var request = require("request");
var fs = require("fs");

var CITY = {
  PHL: 127,
  PITT: 128,
  PSU: 137
};

var ENDPOINTS = {
  TRAVEL_DATES: {
    url: "https://us.megabus.com/journey-planner/api/journeys/travel-dates",
    qs: {
      originCityId: CITY.PITT,
      destinationCityId: CITY.PHL
    }
  },
  JOURNEY_DETAILS: {
    url: "https://us.megabus.com/journey-planner/api/journeys",
    qs: {
      originId: CITY.PITT,
      destinationId: CITY.PHL,
      departureDate: "2017-10-13",
      totalPassengers: 1,
      concessionCount: 0,
      nusCount: 0,
      days: 1
    }
  }
};

// request(ENDPOINTS.JOURNEY_DETAILS)
//   .pipe(fs.createWriteStream('journey-details.json'));


var megabus = require("megabus");
var nodemailer = require("nodemailer");

var finder = new megabus.TicketFinder('9/1/2017', '9/30/2017', [
  // New York <-> Philadelphia
  new megabus.Route('New York', 'Philadelphia'),
  new megabus.Route('Philadelphia', 'New York'),
]);



var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'megabus.ticket.finder@gmail.com',
        pass: 'megabusticket'
    }
});

// setup email data with unicode symbols
var mailOptions = {
    from: '"MEGA BUS FINDER" <megabustickerfinder@gmail.com>', // sender address
    to: 'matvarughese3@gmail.com', // list of receivers
    subject: 'Cheapest Ticket NY to PHL', // Subject line
    html: '' // html body
};

finder.getTicketsInPriceRange(0, 5)
  .then(function(tickets) {
      tickets.forEach((ticket, idx) => {
        mailOptions.html += `[${idx + 1}] ${ticket}<br>`;
      });
      console.log(`*** ${tickets.length} tickets found ***`);

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });

  });
