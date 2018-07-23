'use strict';
const express = require('express');
const app = express();
const api = require('./server/api-handler.js');

app.use(express.static('./client'));

app.get('/api', (request, response) => {
  api(request.query,
    (data) => {
      response.send(data)
    },
    (data) => {
      response.send(data)
    }
  );
});
app.get('*', (request, response) => {
  if (request.query.endpoint !== undefined) {;
    api(request.query, (data) => {
      response.send(data)
    });
  }
  else {
    response.sendFile(__dirname + '/client/build/index.html');
  }
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Assister on port ' + app.get('port'));
});