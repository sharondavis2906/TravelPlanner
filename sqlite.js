import SQLite from 'react-native-sqlite-storage';

// Enable SQLite debugging (optional)
SQLite.enablePromise(true);

const databaseName = 'tripsDatabase.db';

const createTables = async (db) => {
  const createTripsTable = `CREATE TABLE IF NOT EXISTS trips (
    trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_name TEXT NOT NULL
  );`;

  const createTripsByDateTable = `CREATE TABLE IF NOT EXISTS trips_by_date (
    trip_id INTEGER,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id)
  );`;

  const createRecommendsTable = `CREATE TABLE IF NOT EXISTS recommends (
    recommend_id INTEGER PRIMARY KEY AUTOINCREMENT,
    recommend_name TEXT NOT NULL,
    lat REAL NOT NULL,
    long REAL NOT NULL,
    description TEXT,
    review TEXT,
    stars_rate INTEGER CHECK (stars_rate >= 0 AND stars_rate <= 5)
  );`;

  const createRecommendInTripTable = `CREATE TABLE IF NOT EXISTS recommend_in_trip (
    trip_id INTEGER,
    recommend_id INTEGER,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id),
    FOREIGN KEY (recommend_id) REFERENCES recommends(recommend_id)
  );`;

  const createLabelsTypesTable = `CREATE TABLE IF NOT EXISTS labels_types (
    label_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    label_type_name TEXT NOT NULL
  );`;

  const createLabelsTable = `CREATE TABLE IF NOT EXISTS labels (
    label_id INTEGER PRIMARY KEY AUTOINCREMENT,
    label_name TEXT NOT NULL,
    label_type_id INTEGER,
    FOREIGN KEY (label_type_id) REFERENCES labels_types(label_type_id)
  );`;

  const createRecommendLabelsTable = `CREATE TABLE IF NOT EXISTS recommend_labels (
    recommend_id INTEGER,
    label_id INTEGER,
    FOREIGN KEY (recommend_id) REFERENCES recommends(recommend_id),
    FOREIGN KEY (label_id) REFERENCES labels(label_id)
  );`;

  // Execute the SQL statements
  await db.transaction((txn) => {
    txn.executeSql(createTripsTable);
    txn.executeSql(createTripsByDateTable);
    txn.executeSql(createRecommendsTable);
    txn.executeSql(createRecommendInTripTable);
    txn.executeSql(createLabelsTypesTable);
    txn.executeSql(createLabelsTable);
    txn.executeSql(createRecommendLabelsTable);
  });
};

const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabase({ name: databaseName, location: 'default' });
    await createTables(db);
    console.log('Database and tables created successfully!');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Call the initDatabase function where appropriate in your app
initDatabase();
