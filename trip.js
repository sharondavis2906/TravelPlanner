// trips_manager.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList,TouchableOpacity,Image, StyleSheet } from 'react-native';
import { execQuery, selectQuery } from './sqlite'; 
import AirplaneImage from './images/airplane.png'
import Icon from 'react-native-vector-icons/AntDesign';

import { Calendar } from 'react-native-calendars';

const Trip = ({tripName, tripId, setShowTrip}) => {
  const [selectedStart, setSelectedStart] = useState('');
  const [selectedEnd, setSelectedEnd] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    loadTrip()
  }, [tripId]);

  const formatDate = (dateString) => {
    if (dateString){
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}.${month}.${year}`;
    }
    else{
      return '______'
    }
  };

  const onDayPress = (day) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Set start date if not already set or if end date is set
      setSelectedStart(day.dateString);
      setSelectedEnd(''); // Clear end date
    } else {
      // Set end date
      setSelectedEnd(day.dateString);
    }
  };

  const markedDates = {
    [selectedStart]: { selected: true, marked: true, selectedColor: 'blue' },
    [selectedEnd]: { selected: true, marked: true, selectedColor: 'blue' },
  };

  const loadTrip = async () => {
    const tripDates = await selectQuery(`SELECT start_date, end_date FROM trips_by_date where trip_id='${tripId}';`);
    console.log(tripDates)
    if(tripDates.length==1){
      setSelectedStart(tripDates[0]['start_date'])
      setSelectedEnd(tripDates[0]['end_date'])

    }

  };

  const save = async () => {
    await execQuery(`INSERT INTO trips_by_date (trip_id, start_date, end_date) VALUES ('${tripId}', '${selectedStart}', '${selectedEnd}') ON CONFLICT(trip_id) DO UPDATE SET start_date = excluded.start_date, end_date = excluded.end_date;`)
  setShowTrip(false)
  };


  return (
    <View style={styles.container} >
<Image
position='absolute'
        source={AirplaneImage} 
        style={styles.image}// Replace with your image URL
        resizeMode="cover" // Or 'contain', depending on your preference
      />
                              <Text style={styles.text}>{tripName}</Text>
                              <TouchableOpacity onPress={() =>setShowTrip(false)} >
                              <Icon name="back" size={30} color="#000" style={styles.backIcon} />

                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => setIsCalendarVisible(!isCalendarVisible)}>
                              <Icon name="calendar" size={30} color="#000" style={styles.icon} />


        <Text style={styles.underline}>{formatDate(selectedStart)} - {formatDate(selectedEnd)}</Text>

      </TouchableOpacity>
      
                       {isCalendarVisible &&      
                               <View style={styles.calendarContainer}>

                        <Calendar
        onDayPress={onDayPress}
        markingType={'multi-dot'}
        markedDates={markedDates}
      />
      </View>
                       }
                              <TouchableOpacity onPress={() =>save()} >
                              <Icon name="save" size={50} color="#000" style={styles.saveIcon} />

                              </TouchableOpacity>
                              <TouchableOpacity onPress={() =>setShowTrip(false)} >
                              <Icon name="enviromento" size={45} color="#000" style={styles.mapIcon} />

                              </TouchableOpacity>

          </View>
  );
};


const styles = StyleSheet.create({
container: {
flex: 1,
},
image: {
width: 100, 
height: 100, 
position: 'absolute', 
top: 0,
right: 5,
},
text: {
  textAlign:'right',
position: 'absolute',
top: 15, 
right: 55, 
fontSize: 30, 
},
icon: {
position: 'absolute',
top: 50,
right: 53, 
},  calendarContainer: {
  width:250,
  marginTop: 20,
  position: 'absolute',
top: 60,
right: 70, 
},
underline: {
  textDecorationLine: 'underline',
  position: 'absolute',
top: 56, // Adjust this value to move the text vertically
right: 86, // Adjust this value to move the text horizontally
fontSize: 20, 
},
backIcon: {
  position: 'absolute',
  top: 20,
  left: 20, 
  },
  saveIcon: {
    position: 'absolute',
    top: 680,
    left: 20, 
    },
    mapIcon: {
      position: 'absolute',
      top: 680,
      left: 90, 
      },
});


export default Trip;
