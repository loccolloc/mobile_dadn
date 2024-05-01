
import {View, Text, StyleSheet,TouchableOpacity,ActivityIndicator } from 'react-native';
import React, { useState,useEffect  } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';



const Header = () => {
  const [devices, setDevices] = useState([]);
  const [displayValue, setDisplayValue] = useState('0°C'); 
  const [selectedOption, setSelectedOption] = useState('option1');
  const [chartColor, setChartColor] = useState('#bcf5bc');

  useEffect(() => {
    axios.get('https://io.adafruit.com/api/v2/manhtrannnnnn/feeds')
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    
    if (devices.length > 0) {
      updateDisplay(selectedOption);
    }
  }, [devices, selectedOption]);

  const updateDisplay = (option) => {
    const colorMap = {
      'option1': '#bcf5bc',
      'option2': '#ade2e6',
      'option3': '#fffee2',
      'option4': '#848884',
      
    };

    let selected = devices.find(device => {
      if (option === 'option1') return device.key === 'temperature';
      if (option === 'option2') return device.key === 'earthhumidity';
      if (option === 'option3') return device.key === 'light';
      if (option === 'option4') return device.key === 'airhumidity';
      return null;
    });

    if (selected) {
      const displayFormat = selected.key === 'temperature' ? `${selected.last_value}°C` :
                            selected.key === 'earthhumidity' ? `${selected.last_value}%` :
                            selected.key === 'airhumidity' ? `${selected.last_value}%` :
                            selected.key === 'light' ? `${selected.last_value} Lux` :
                            `${selected.last_value}`;
      setDisplayValue(displayFormat);
    } else {
      setDisplayValue('0°C');
    }

    setSelectedOption(option);
    setChartColor(colorMap[option]);
  };

  const getButtonStyle = (option) => (
    selectedOption === option ? styles.buttonSelected : styles.button
  );

  return (
    <View style={[styles.chart, { backgroundColor: chartColor }]}>
      <Text style={styles.displayValue}>{displayValue}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => updateDisplay('option1')} style={getButtonStyle('option1')}>
          <MaterialCommunityIcons name="thermometer" size={30} color="#57B97D" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateDisplay('option2')} style={getButtonStyle('option2')}>
          <MaterialCommunityIcons name="water" size={30} color="#72bcd4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateDisplay('option3')} style={getButtonStyle('option3')}>
          <MaterialCommunityIcons name="lightbulb" size={30} color="#fdfa72" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateDisplay('option4')} style={getButtonStyle('option4')}>
          <MaterialCommunityIcons name="weather-windy" size={30} color="#848884" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles= StyleSheet.create({
  chart:{
      width:'93%',
      height:'33%',
      alignItems:'center',
      justifyContent:'center',
     backgroundColor:'rgba(255, 255, 255, 0.55)',
     alignSelf: 'center',
     borderRadius:35,
     marginTop: -30,
     

  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: '#DDD',
    borderRadius:50,
  },
  buttonSelected: {
    padding: 10,
    margin: 10,
    backgroundColor: '#ffcccb', 
    borderRadius:50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
   displayValue: {
    fontSize: 32,
    marginBottom: 20,
  },



});

export default Header;