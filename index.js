var express = require('express');
var app = express();
var hbs = require('hbs');
var pg = require('pg');


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));



app.set('views', __dirname + '/views');
app.set('view engine', hbs);



app.get('/', function (req, res) {
  res.render('frontpage.hbs');
});

app.get('/cadastrocamp', function (req, res) {
  res.render('cadastrocamp.hbs');
});
app.get('/lista', function (req, res) {
  res.render('lista.hbs');
});
app.get('/cadastro', function (req, res) {
  res.render('cadastro.hbs');
});

app.get('/campeonatochaves', function (req, res) {
  res.render('campeonatochaves.hbs');
});


app.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Node app is running on port', app.get('port'));
});



app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('views/frontpage', {results: result.rows} ); }
    });
  });
});
