
import {View, Text, StyleSheet,Switch,Image,TouchableOpacity,Alert} from 'react-native';
import Sensor from '../assets/Sensor.png';

import React, { useState,useEffect  } from 'react';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { apiBaseUrl } from '../config';
import {useNavigation} from '@react-navigation/native';

const setHeaders = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  
  if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  if (refreshToken) {
    axios.defaults.headers.common['Refresh-Token'] = `Bearer ${refreshToken}`;
  } else {
    delete axios.defaults.headers.common['Refresh-Token'];
  }
};


async function updateDeviceState(deviceID, newState) {
  await setHeaders(); 
  try {
    const response = await axios.patch(`${apiBaseUrl}/device/${deviceID}`, {
      deviceState: newState ? 'ON' : 'OFF',
      lastValue: newState ? 1 : 0,
      updatedTime: new Date().toISOString(),
    });
    console.log("Device state updated:", response.data);
  } catch (error) {
   alert("Báo lỗi",error);
   console.log("log lỗi",error);
  }
}
const SensorView = () => {
  const navigation = useNavigation();
  const [deviceState, setDeviceState] = useState(false);

  
  return (
    
    
    <TouchableOpacity style={styles.box} onPress={()=>{ navigation.navigate('SensorDetail') }}>
    <View style={styles.inner}>
     <View style={styles.container2}>
    
    <View style={styles.box2}>
    <View style={styles.insider}>
 <Image source={Sensor} style={{width:90, height:90}}/>
    
        </View>
  </View>
  
  <View style={styles.box3}>
    <View style={styles.insider}>
    <Text style={styles.textStyle}>Cảm biến độ ẩm đất</Text>
       

        </View>
  </View>
     


            </View>
           
        </View>
  </TouchableOpacity>
  
           



  );
};
const styles= StyleSheet.create({
 
  box:{
      width:'50%',
      height:'50%',
     padding:5,
     

  },
  inner:{

    flex:1,
    backgroundColor:'#ffb38a',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:35,
   
    
  },
  

   container2:{
    width:'100%',
    height:'60%',
    padding:5,
    flexDirection:'row',
    flexWrap:'wrap',
   

  },
  box2:{
      width:'100%',
      height:'50%',
     padding:5,

  },
  box3:{
      width:'100%',
      height:'50%',
     padding:5,
     marginTop:10,

  },
  insider:{

    flex:1,
    // backgroundColor:'#eee',
    alignItems:'center',
    justifyContent:'center'
  },
  textStyle:{
       fontWeight:'bold',
         alignItems:'center',
         fontSize:18,

  }



});

export default SensorView;