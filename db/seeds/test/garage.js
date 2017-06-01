
exports.seed = function(knex, Promise) {
  return knex('stuff').del()
  .then(() => {
    return Promise.all([
      knex('stuff').insert({
        id: 1,
        name: 'cat figurines',
        reason: 'unused',
        cleanliness: 'rancid'
      }),
      knex('stuff').insert({
        id: 2,
        name: 'purses',
        reason: 'have too many',
        cleanliness: 'sparkling'
      }),
      knex('stuff').insert({
        id: 3,
        name: 'luggage',
        reason: 'ugly',
        cleanliness: 'dusty'
      }),
      knex('stuff').insert({
        id: 4,
        name: 'books',
        reason: 'unused',
        cleanliness: 'dusty'
      }),
      knex('stuff').insert({
        id: 5,
        name: 'vhs tapes',
        reason: 'obsolete',
        cleanliness: 'dusty'
      }),
    ])
  })
}
