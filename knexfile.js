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
            database: process.env.DB_URL,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        },
        migrations: {
            directory: "./db/migrations"
        },
        seeds: {
            directory: "./db/seeds"
        }
    }

}