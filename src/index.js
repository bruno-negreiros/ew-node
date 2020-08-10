const ContextStrategy = require('./db/strategies/base/contextStrategy.js');
const MongoDB = require('./db/strategies/mongodb.js');
const Postgres = require('./db/strategies/postgres.js');

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create();

const contextPostgres = new ContextStrategy(new Postgres());
contextPostgres.create();

// contextMongo.read();