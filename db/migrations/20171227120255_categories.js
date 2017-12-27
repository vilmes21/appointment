
exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', function (table) {
      table.integer("id").notNullable();
      table.integer("category_type_id").unsigned().notNullable();
      table.foreign("category_type_id").references("category_types.id");
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('categories');
  };
  