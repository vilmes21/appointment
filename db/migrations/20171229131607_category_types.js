exports.up = function (knex, Promise) {
    return knex.schema.createTable('category_types', function (table) {
        table.integer("id").notNullable();
        table.unique("id");
        
        table.string('name').notNullable();
        table.unique('name');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('category_types');
};