exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_roles', function (table) {
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("users.id");
      
      table.integer("role_id").unsigned().notNullable();
      table.foreign("role_id").references("categories.id");

      table.unique(["user_id", "role_id"]);
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_roles');
  };