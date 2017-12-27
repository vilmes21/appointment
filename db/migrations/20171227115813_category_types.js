
exports.up = function(knex, Promise) {
    return knex.schema.createTable('category_types', function (table) {
      table.increments();
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('category_types');
  };
  