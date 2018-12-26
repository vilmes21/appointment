const appkeys = require("../appkeys.js")
const config = require("../knexfile")[appkeys.nodeEnv];
module.exports = require("knex")(config);