// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

const friends = require('../data/friends.js');

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get('/api/friends', (req, res) => {
    res.json(tableData);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post('/api/friends', (req, res) => {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware

    const parsed = req.body.scores.map((x) => parseInt(x, 10));
    req.body.scores = parsed;

    const newFriend = req.body.scores;

    // console.log(friends);

    // will hold the objects to be sorted to find the best match
    const matches = [];
    // loop through friend objects
    for (let i = 0; i < friends.length; i += 1) {
      let totalDifference = 0;
      // loops through answers
      for (let j = 0; j < newFriend.length; j += 1) {
        const current = Math.abs(newFriend[j] - friends[i].scores[j]);

        totalDifference += current;
      }
      // object that holds the match number and the position in the original array
      const matchObject = {
        number: totalDifference,
        position: i,
      };
      // pushes object into array
      matches.push(matchObject);
    }

    console.log(matches);
    // sorting matches to find lowest number, match will be position 0
    matches.sort((a, b) => a.number - b.number);

    console.log(matches);
    // adding the new person into the list of friends
    friends.push(req.body);

    // sending the match back to html
    res.json(friends[matches[0].position]);
  });
};
