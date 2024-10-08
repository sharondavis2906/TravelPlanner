// sqlite.js
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabaseSync('databaseName');


// Function to execute a non-select query (INSERT, UPDATE, DELETE)
const execQuery = (query) => {
    db.execSync(query)
};

// Function to select data from the database
const selectQuery = (query) => {
  return db.getAllSync(query)
};


export { execQuery, selectQuery };
