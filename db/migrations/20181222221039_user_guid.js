const guidColName = "guid_id";
const emailColName = "email_confirmed"

exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.string(guidColName).notNull().defaultTo("old-default");
        t.boolean(emailColName).notNullable().defaultTo(false);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.dropColumn(guidColName);
        t.dropColumn(emailColName);
    });
};
