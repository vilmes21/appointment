
exports.up = function(knex, Promise) {
    return knex.schema.createTable('availabilities', function (table) {
      table.increments();
      table.integer('doctor_id').unsigned();
      table.foreign('doctor_id').references('doctors.id');
      table.time('start_at').notNullable();
      table.time('end_at').notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('availabilities');
  };
  