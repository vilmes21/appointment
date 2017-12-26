var faker = require('faker');

let createRecord = (knex) => {
  return knex('users').insert({
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: '123',
    phone: '6041112222',
    created_at: new Date(),
    updated_at: new Date()
  })
}

exports.seed = (knex, Promise) => {
  let records = [];

  for (let i = 1; i < 10; i++) {
    records.push(createRecord(knex))
  }

  return Promise.all(records);
};