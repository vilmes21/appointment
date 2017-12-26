var faker = require('faker');

const images = [
  "https://impactspace.com/images/uploads/person-default.png",
  "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Person-Male-Light-icon.png",
  "https://cdn3.iconfinder.com/data/icons/users-6/100/2-256.png",
  "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/128x128/person.png",
  "http://riversidebaseball.com/wp-content/uploads/2016/03/person-128x128.jpg",
  "https://cdn2.bigcommerce.com/n-d57o0b/uy19bphl/product_images/uploaded_images/overview.png?t=1478020824"
];

let createRecord = (knex, drUser) => {
  console.log("I am being called with drUser >>>", drUser);

  return knex('doctors').insert({
    photo: images[Math.floor(Math.random() * images.length)],
    bio: faker.lorem.sentence(),
    user_id: drUser
  })
}

exports.seed = function(knex, Promise) {
  knex("users").select('id').pluck('id') // get all ids as an array
  .then((drUsers) => {
    let myPros = [];

    for (var u = 0; u < Math.floor(drUsers.length / 2); u++){
      myPros.push(createRecord(knex, drUsers[u]));
    }

    return Promise.all(myPros); //bug: not creating as many as desired
  })
  .catch((err) => {
    console.log("err >>>", err);
  })
};