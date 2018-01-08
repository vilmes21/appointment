
exports.up = function(knex, Promise) {
    return knex.schema.table('doctors', function (table) {
        table.unique('url_name');
        table.unique('user_id');
      })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('doctors', function (table) {
        table.dropUnique('url_name');
        table.dropUnique('user_id');
      })
};
