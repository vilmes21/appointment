module.exports = {

    development: {
        client: 'pg',
        connection: {
            database: 'clinic_dev'
        },
        migrations: {
            directory: "./db/migrations"
        },
        seeds: {
            directory: "./db/seeds"
        }
    },
    production: {
        client: 'pg',
        connection: {
            database: process.env.DB_URL
        },
        migrations: {
            directory: "./db/migrations"
        },
        seeds: {
            directory: "./db/seeds"
        }
    }

}