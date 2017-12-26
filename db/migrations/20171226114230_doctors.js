
exports.up = function(knex, Promise) {
    return knex.schema.createTable('doctors', function (table) {
        table.increments();
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id');
        table.string('photo');
        table.string('bio');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('doctors');
};
