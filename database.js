var sqlite3 = require("sqlite3");
var mkdirp = require("mkdirp");

mkdirp.sync("./var/db");

var database = new sqlite3.Database("./var/db/todos.db");

database.serialize(function () {
  database.run(
    "CREATE TABLE IF NOT EXISTS todos ( \
    id INTEGER PRIMARY KEY, \
    title TEXT NOT NULL, \
    description TEXT NOT NULL, \
    due_date TEXT NOT NULL, \
    completed INTEGER \
  )"
  );
});

module.exports = database;
