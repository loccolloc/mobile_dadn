
import {View, Text, StyleSheet,Switch,Image,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Light from '../assets/Light.png';
import {useNavigation} from '@react-navigation/native';
import React, { useState } from 'react';
import axios from 'axios'; 
import { apiBaseUrl } from '../config';

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
const LightView = () => {
  const navigation=useNavigation();
  const [deviceState, setDeviceState] = useState(false);

  
  const handleSwitchChange = async (newValue) => {
   
    setDeviceState(newValue);
    
    await updateDeviceState('2720945', newValue);  
  };
  return (
   
    


  <TouchableOpacity style={styles.box} onPress={()=>{ navigation.navigate('LightDetail')}}>
    <View style={styles.inner2}>
     <View style={styles.container2}>
    
    <View style={styles.box2}>
    <View style={styles.insider}>
    <Image source={Light} style={{width:50, height:50}}/>
        </View>
  </View>
  <View style={styles.box2}>
    <View style={styles.insider}>
    <Switch value={deviceState} onValueChange={handleSwitchChange}
      trackColor={{false:"#fff", true:"green"}}
      thumbColor="f4f3f4"
      />

      
        </View>
  </View>
  <View style={styles.box3}>
    <View style={styles.insider}>
     <Text style={styles.textStyle} >Đèn</Text>
    
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
  
  inner2:{

    flex:1,
    backgroundColor:'rgba(255, 255, 224, 0.8)',
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
      width:'50%',
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
         fontSize:20,

  }



});

export default LightView;