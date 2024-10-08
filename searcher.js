import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Adjust if using a different icon library

const Searcher = ({handleSearch, searchResults, clearSearch, renderSearchResult}) => {
    const [searchQuery, setSearchQuery] = useState('');
  

    return (
    <View  width='100%' marginTop={5} marginButtom={5}  >
      <View style={styles.searchContainer} >
      <TouchableOpacity onPress={() => clearSearch(setSearchQuery)} style={styles.iconButton}>
          <Icon name="times" size={20} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => handleSearch(searchQuery)} style={styles.iconButton}>
          <Icon name="search" size={20} color="#000" />
        </TouchableOpacity>

      </View>
      <FlatList top={0} buttom={0} left={0} right={0} position='abosulte'
        data={searchResults}
        keyExtractor={(item) => item.place_id}
        renderItem={({item}) => renderSearchResult({item, setSearchQuery})}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    paddingLeft: 10,
  },
  iconButton: {
    padding: 10,
  },
  resultItem: {
    padding: 10  },
  map: {
    flex: 1,
  },
});

export default Searcher;
