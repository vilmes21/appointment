exports.up = function (knex, Promise) {
    return knex.schema.createTable('appointments', function (table) {
        table.increments();

        table.integer("doctor_id").unsigned().notNullable();
        table.foreign("doctor_id").references("doctors.id");

        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references("users.id");

        table.integer("status").unsigned().notNullable().defaultTo(304); //default to `booked`
        table.foreign("status").references("categories.id");

        table.integer("about").unsigned();
        table.foreign("about").references("categories.id");

        table.dateTime('wish_start_at').notNullable();
        table.dateTime('wish_end_at').notNullable();

        table.dateTime('started_at');
        table.dateTime('ended_at');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('appointments');
};