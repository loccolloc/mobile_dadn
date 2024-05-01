import React, { useState } from 'react';
import { View, Text, Platform, Alert, TouchableOpacity, StyleSheet,Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimeSchedule = ({ schedule, setSchedule }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); 
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    const newSchedule = [...schedule];
    const timeString = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
    if (mode === 'start') {
      newSchedule[editingIndex].startTime = timeString;
    } else {
      newSchedule[editingIndex].endTime = timeString;
    }
    setSchedule(newSchedule);
  };

  const showMode = (currentMode, index) => {
    setShow(true);
    setMode(currentMode);
    setEditingIndex(index);
    const currentTime = currentMode === 'start' ? schedule[index].startTime : schedule[index].endTime;
    const localDate = new Date();
    const [hours, minutes] = currentTime.split(':');
    localDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);  // Set time based on local timezone
    setDate(localDate);
  };

  const addScheduleItem = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setSchedule([...schedule, { startTime: currentTime, endTime: currentTime }]);
  };

  const removeScheduleItem = () => {
    if (schedule.length > 0) {
      const newSchedule = schedule.slice(0, -1);
      setSchedule(newSchedule);
    } else {
      Alert.alert("No more schedule items to remove");
    }
  };

  return (
    <View>
      {schedule.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
 <TouchableOpacity onPress={() => showMode('start', index)} style={styles.button}>
            <Text style={styles.buttonText}>Set Start</Text>
          </TouchableOpacity>
                    <Text>{item.startTime}</Text>
                    <TouchableOpacity onPress={() => showMode('end', index)} style={styles.button}>
            <Text style={styles.buttonText}>Set End</Text>
          </TouchableOpacity>
          <Text>{item.endTime}</Text>
        </View>
      ))}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
      <TouchableOpacity onPress={addScheduleItem} style={styles.buttonAdd}>
          <Text style={styles.buttonTextAdd}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={removeScheduleItem} style={styles.buttonDelete}>
          <Text style={styles.buttonTextDelete}>-</Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#DDDDDD',  
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  buttonText: {
    color: 'black',  
    fontSize: 18    
  },
  buttonAdd:{
    backgroundColor: '#90ee90',  
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius:5
  },
  buttonDelete:{
    backgroundColor: '#FF474C',  
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius:5
  },
  buttonTextAdd: {
    color: 'white',  
    fontSize: 20 ,
    fontWeight:'bold',   
  },
  buttonTextDelete: {
    color: 'white', 
    fontSize: 20 ,
    fontWeight:'bold',    
  },
});

export default TimeSchedule;
