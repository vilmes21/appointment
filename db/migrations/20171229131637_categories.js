exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', function (table) {
      table.integer("id").notNullable();
      table.unique("id");

      table.integer("category_type_id").unsigned().notNullable();
      table.foreign("category_type_id").references("category_types.id");

      table.string('name').notNullable();

      table.integer('rank');
      table.unique(["category_type_id", "rank"]);      
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('categories');
  };