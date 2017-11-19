const knex = require("knex")({
    client: "pg",
    connection: {
        database: "clinic_dev"
    }
})

knex.schema.createTableIfNotExists('users2', function (table) {
    table.increments();
    table.string('name2');
    table.timestamps();
  }).then(()=>{
      console.log("done");
  })


knex('users2').insert({name2: 'Slaughtsderhouse Five'}).then(()=>{
    console.log("done 2")
});
knex('users2').insert({name2: 'Slaug sd hterhouse Five'}).then(()=>{
    console.log("done 2")
});
knex('users2').insert({name2: 'Slau sdouse Five'}).then(()=>{
    console.log("done 2")
});

module.exports = knex;