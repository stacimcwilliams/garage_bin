
exports.seed = function (knex, Promise) {
  return knex('stuff').del()
  .then(() => {
    return Promise.all([
      knex('stuff').insert({
        name: 'cat figurines',
        reason: 'unused',
        cleanliness: 'rancid',
      }),
      knex('stuff').insert({
        name: 'purses',
        reason: 'have too many',
        cleanliness: 'sparkling',
      }),
      knex('stuff').insert({
        name: 'luggage',
        reason: 'ugly',
        cleanliness: 'dusty',
      }),
      knex('stuff').insert({
        name: 'books',
        reason: 'unused',
        cleanliness: 'dusty',
      }),
      knex('stuff').insert({
        name: 'vhs tapes',
        reason: 'obsolete',
        cleanliness: 'dusty',
      }),
    ]);
  });
};
