
exports.up = function(knex, Promise) {
    return knex.schema.createTable('log', function (table) {
        table.increments();
        table.integer("userId").unsigned().nullable();
        table.dateTime('time').notNullable();
        table.text('message');
        table.text('notes');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('log');
};
