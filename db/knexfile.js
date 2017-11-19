module.exports = {

    development: {
        client: 'pg',
        connection: {
            database: 'clinic_dev'
        },
        migrations: {
            directory: "./migrations"
        },
        seeds: {
            directory: "./seeds"
        }
    },
    production: {
        client: 'pg',
        connection: {
            database: process.env.DB_URL
        },
        migrations: {
            directory: "./migrations"
        },
        seeds: {
            directory: "./seeds"
        }
    }

}