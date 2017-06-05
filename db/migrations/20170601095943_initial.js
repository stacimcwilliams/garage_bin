
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('stuff', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.string('reason');
      table.string('cleanliness');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('stuff'),
  ]);
};
