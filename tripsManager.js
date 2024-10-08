// trips_manager.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList,TouchableOpacity } from 'react-native';
import { execQuery, selectQuery } from './sqlite'; // Adjust the path as necessary
import Searcher from './searcher'

const TripManager = () => {
  const [tripName, setTripName] = useState('');
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const initializeDatabase = async () => {
      await execQuery('CREATE TABLE IF NOT EXISTS trips (trip_id INTEGER PRIMARY KEY AUTOINCREMENT, trip_name TEXT UNIQUE NOT NULL);')
      await execQuery('CREATE TABLE IF NOT EXISTS trips_by_date (trip_id INTEGER,start_date TEXT NOT NULL,end_date TEXT NOT NULL,FOREIGN KEY (trip_id) REFERENCES trips(trip_id));')
      await execQuery('CREATE TABLE IF NOT EXISTS recommends (recommend_id INTEGER PRIMARY KEY AUTOINCREMENT,recommend_name TEXT NOT NULL,lat REAL NOT NULL,long REAL NOT NULL,description TEXT,review TEXT,stars_rate INTEGER CHECK (stars_rate >= 0 AND stars_rate <= 5));')
      await execQuery('CREATE TABLE IF NOT EXISTS recommend_in_trip (trip_id INTEGER,recommend_id INTEGER,FOREIGN KEY (trip_id) REFERENCES trips(trip_id),FOREIGN KEY (recommend_id) REFERENCES recommends(recommend_id));')
      await execQuery('CREATE TABLE IF NOT EXISTS labels_types (label_type_id INTEGER PRIMARY KEY AUTOINCREMENT,label_type_name TEXT UNIQUE NOT NULL);')
      await execQuery('CREATE TABLE IF NOT EXISTS labels ( label_id INTEGER PRIMARY KEY AUTOINCREMENT, label_name TEXT UNIQUE NOT NULL, label_type_id INTEGER, FOREIGN KEY (label_type_id) REFERENCES labels_types(label_type_id));')
      await execQuery('CREATE TABLE IF NOT EXISTS recommend_labels (recommend_id INTEGER,label_id INTEGER,FOREIGN KEY (recommend_id) REFERENCES recommends(recommend_id),FOREIGN KEY (label_id) REFERENCES labels(label_id));')

      loadTrips();
    };

    initializeDatabase();
  }, []);

  const loadTrips = async () => {
    const allTrips = await selectQuery('SELECT * FROM trips;');
    console.log(allTrips)
    setTrips(allTrips);
  };

  const handleAddTrip = async () => {
    if (tripName) {
      await execQuery(`INSERT INTO trips (trip_name) VALUES ('${tripName}');`);
      setTripName('');
      loadTrips(); // Reload trips after adding
    }
  };

  const handleSearch = async (searchQuery) => {
    const allTrips = await selectQuery('SELECT * FROM trips;');

    const filteredTrips = allTrips.filter(trip =>
        trip.trip_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTrips(filteredTrips)
  };

  const handleResultPress = (item, setSearchQuery) => {

    };

    const clearSearch = (setSearchQuery) => {
        setSearchQuery('');
        loadTrips();
      };

      const renderSearchResult = ({item, setSearchQuery}) => {
        return (
    <TouchableOpacity onPress={() => handleResultPress(item, setSearchQuery)} borderWidth={1} >
                <View >
                  <Text>{item.trip_name}</Text>
                </View>
              </TouchableOpacity>
        )
      };
  return (
    <View>
                < Searcher handleSearch={handleSearch} searchResults={trips} clearSearch={clearSearch} renderSearchResult={renderSearchResult} keyExtractor={(item) => item.trip_id} />
      <TextInput
        value={tripName}
        onChangeText={setTripName}
        placeholder="Enter trip name"
      />
      <Button title="Add Trip" onPress={handleAddTrip} />
    </View>
  );
};

export default TripManager;
