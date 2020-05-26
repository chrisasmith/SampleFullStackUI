const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');
const {check, validationResult} = require('express-validator');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.delete('/api/members/:id', (req, res) => {
  console.log('Delete: ', req.params.id);
  request.delete(`http://localhost:3000/members/${req.params.id}`, (error, r, body) => {
    if (error) {
      console.error(error);
      res.send(error);
      return
    }
    request('http://localhost:3000/members', (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send(body);
      }
    });
  });
});

// TODO: Dropdown!
app.get('/api/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// Submit Form!
app.post('/api/addMember', [
  check('firstName').exists(),
  check('lastName').exists(),
  check('jobTitle').exists(),
  check('team').exists(),
  check('status').exists()
], (req, res, next) => {
  try {
    validationResult(req).throw();
    request.post('http://localhost:3000/members', {json: req.body}, (error, r, body) => {
      if (error) {
        console.error(error);
        return
      }
      res.send(body);
    })
  } catch (err) {
    res.status(422).json({errors: err.errors});
  }

});

app.put('/api/members/:id', [
  check('firstName').exists(),
  check('lastName').exists(),
  check('jobTitle').exists(),
  check('team').exists(),
  check('status').exists()
], (req, res, next) => {
  try {
    validationResult(req).throw();
    request.put(`http://localhost:3000/members/${req.params.id}`, {json: req.body}, (error, r, body) => {
      if (error) {
        console.error(error);
        return
      }
      res.send(body);
    })
  } catch (err) {
    res.status(422).json({errors: err.errors});
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
