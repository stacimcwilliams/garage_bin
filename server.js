const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[enviroment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'GarageBin';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('lib'));

app.get('/', (request, response ) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

// get all items in the garage_bin

app.get('/api/v1/stuff', (request, response) => {
  database('stuff').select()
  .then(stuff => {
    response.status(200).json(stuff);
  })
  .catch(error => {
    response.sendStatus(500).send({ error });
  });
});

// sort a-z

app.get('/api/v1/stuff/sort', (request, response) => {
  database('stuff').select().orderBy('name', 'asc')
  .then(stuff => {
    response.status(200).json(stuff);
  })
  .catch(error => {
    response.sendStatus(500).send({ error });
  });
});

// get a single item in the garage_bin

app.get('/api/v1/stuff/:id', (request, response) => {
  const { id } = request.params;

  database('stuff').select().where('id', id)
  .then((stuff) => {
    if (!stuff.length) {
      response.status(404).send({ error: 'Stuff is not there!' });
    } else {
      response.status(200).json(stuff);
    }
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});

// add a new thing to garage_bin

app.post('/api/v1/stuff', (request, response) => {
  const validStuff = ['name', 'reason', 'cleanliness'].every(param => request.body[param]);
  const { name, reason, cleanliness } = request.body;

  if (!validStuff) {
    return response.status(422).send({ error: 'You are missing something content in describing your item' });
  }
  database('stuff').insert({ name, reason, cleanliness }, ['id', 'name', 'reason', 'cleanliness'])
  .then((addedStuff) => {
    response.status(200).send(addedStuff[0]);
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});

// update the cleanliness of an item in the garage_bin

app.put('/api/v1/stuff/:id/edit', (request, response) => {
  const { id } = request.params;
  const { cleanliness } = request.body;

  if (!cleanliness) {
    return response.status(422).send('Sorry you did not pass the correct information');
  }
  database('stuff').where('id', id).update({ cleanliness })
  .then(() => {
    database('stuff').where('id', id).select()
    .then((stuff) => {
      response.status(200).json(stuff);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
  });
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;
