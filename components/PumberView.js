
import {View, Text, StyleSheet,Switch,Image,TouchableOpacity,Alert} from 'react-native';
import Pumber from '../assets/Pumber.png';
import {useNavigation} from '@react-navigation/native';
import React, { useState,useEffect  } from 'react';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
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


// async function refreshAccessToken() {
//   const refreshToken = await AsyncStorage.getItem('refreshToken');
  
//   if (refreshToken) {
//     try {
//       const response = await axios.post(
//         `${apiBaseUrl}/login/updateToken`,
//         {},
//         {
//           headers: { 'Refresh-Token': refreshToken }
//         }
//       );
//       await AsyncStorage.setItem('accessToken', response.data.accessToken);
//       await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
//     } catch (error) {
//       console.error("Error refreshing token:", error);
//     }
//   } else {
//     Alert.alert("Error", "Refresh token is not set in AsyncStorage.");
//   }
// }
// async function refreshAccessToken() {
//   const refreshToken = await AsyncStorage.getItem('refreshToken');
 
//   try {
//     const refreshToken = await AsyncStorage.getItem('refreshToken');
//     if (refreshToken) {
//       const response = await axios.post(
//         `${apiBaseUrl}/login/updateToken`,
//         {},
//         {
//           headers: { 'Refresh-Token': refreshToken }
//         }
//       );
//       await AsyncStorage.setItem('accessToken', response.data.accessToken);
//       await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
//     } else {
//       Alert.alert("Error", "Refresh token is not set in AsyncStorage.");
//     }
//   } catch (error) {
//     if (error.response && error.response.status === 401) {
//       // Token expired or invalid, handle it here
//       console.error("Error refreshing token:", error);
//       // For example, you can log user out or redirect to login screen
//     } else {
//       console.error("Unexpected error refreshing token:", error);
//     }
//   }
// }
// Function to handle the device state update
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
const PumberView = () => {
  const navigation = useNavigation();

  const [deviceState, setDeviceState] = useState(false);

  
  const handleSwitchChange = async (newValue) => {
   
    setDeviceState(newValue);
    
    await updateDeviceState('2720946', newValue);  
  };
  return (
    
    
    <TouchableOpacity style={styles.box} onPress={()=>{navigation.navigate('PumberDetail')}}>
    <View style={styles.inner}>
     <View style={styles.container2}>
    
    <View style={styles.box2}>
    <View style={styles.insider}>
 <Image source={Pumber} style={{width:50, height:50}}/>
    
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
    <Text style={styles.textStyle}>Máy bơm</Text>
       

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
    backgroundColor:'#ade2e6',
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

export default PumberView;