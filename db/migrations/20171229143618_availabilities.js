
exports.up = function(knex, Promise) {
    return knex.schema.createTable('availabilities', function (table) {
      table.increments();

      table.integer('doctor_id').unsigned().notNullable();
      table.foreign('doctor_id').references('doctors.id');

      table.dateTime('start_at').notNullable();
      table.dateTime('end_at').notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('availabilities');
  };
  