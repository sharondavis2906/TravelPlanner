import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import Searcher from './searcher'
const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [region, setRegion] = useState({      latitudeDelta: 0.05,
    longitudeDelta: 0.05});

  const handleSearch = async (searchQuery) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&accept-language=he`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResultPress = (item, setSearchQuery) => {
    const newMarker = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      title: item.display_name,
    };

    // Update the markers and center the map on the selected result
    setMarkers((prev) => [...prev, newMarker]);
    setRegion({
      latitude: newMarker.latitude,
      longitude: newMarker.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    setSearchQuery('');
    setSearchResults([]);
  };

  const clearSearch = (setSearchQuery) => {
    setSearchQuery('');
    setSearchResults([]);
  };

  
  const renderSearchResult = ({item, setSearchQuery}) => {
    return (
<TouchableOpacity onPress={() => handleResultPress(item, setSearchQuery)} borderWidth={1} >
            <View >
              <Text>{item.display_name}</Text>
            </View>
          </TouchableOpacity>
    )
  };

  return (
    <View style={styles.container} >
        < Searcher handleSearch={handleSearch} searchResults={searchResults} clearSearch={clearSearch} renderSearchResult={renderSearchResult} keyExtractor={(item) => item.place_id}/>
      <MapView marginTop={5} height='90%' region={region} showsUserLocation={true} moveOnMarkerPress={true} userLocationAnnotationTitle={true}>
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} title={marker.title} />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default MapComponent;
