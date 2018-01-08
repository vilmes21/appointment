
exports.up = function(knex, Promise) {
    return knex.schema.table('doctors', function (table) {
        table.string('url_name', 30).notNullable().defaultTo(Math.ceil(Math.random() * 100)); //length set to 30 chars
      })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('doctors', function (table) {
        table.dropColumn('url_name');
      })
};
