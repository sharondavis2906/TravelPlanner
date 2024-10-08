import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapComponent from './map';

const ModalExample = () => {
  const [visibleModal, setVisibleModal] = useState('map');

  // Function to handle button press
  const openModal = (modalId) => {
    setVisibleModal(modalId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, visibleModal === 'trips' && styles.activeButton]}
          onPress={() => openModal('trips')}
        >
          <Text style={[styles.buttonText, visibleModal === 'trips' && styles.activeButtonText]}>טיולים</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, visibleModal === 'recommends' && styles.activeButton]}
          onPress={() => openModal('recommends')}
        >
          <Text style={[styles.buttonText, visibleModal === 'recommends' && styles.activeButtonText]}>המלצות</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, visibleModal === 'map' && styles.activeButton]}
          onPress={() => openModal('map')}
        >
          <Text style={[styles.buttonText, visibleModal === 'map' && styles.activeButtonText]}>מפה</Text>
        </TouchableOpacity>
      </View>
              {visibleModal === 'map' && <MapComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    marginTop: 50,
    flexDirection: 'row',
    backgroundColor: '#C0C0C0', // Gray background for the entire row
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    padding: 15,
    backgroundColor: 'transparent', // Transparent for button background
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  activeButtonText: {
    color: '#808080',
  },
});

export default ModalExample;
