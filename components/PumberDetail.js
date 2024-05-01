import { View, Text, StyleSheet, TouchableOpacity, Dimensions,Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import CircleSlider from "react-native-circle-slider";
import axios from 'axios'; 
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
async function fetchDevices() {
  await setHeaders();
  const userId = await AsyncStorage.getItem('id'); 
  try {
    const response = await axios.get(`${apiBaseUrl}/device/${userId}`);
    // console.log("Fetched devices:", response.data);
    return response.data.devices; 
  } catch (error) {
    console.error("Failed to fetch devices:", error);
    Alert.alert("Error", "Failed to fetch devices.");
    return [];
  }
}

async function updateDeviceState(deviceID, newState, setDeviceInfo, setDeviceState) {
  await setHeaders(); 
  try {
    const response = await axios.patch(`${apiBaseUrl}/device/${deviceID}`, {
      deviceState: newState ? 'ON' : 'OFF',
      lastValue: newState ? 1 : 0,
      updatedTime: new Date().toISOString(),
    });
    // console.log("Device state updated:", response.data);
    if (response.data && response.data.device) {
      // Update the local component state with the new device data
      setDeviceInfo(response.data.device);
      setDeviceState(response.data.device.deviceState === 'ON');
    }
  } catch (error) {
    alert("Báo lỗi", error.message || "An error occurred");
    console.log("log lỗi", error);
  }
}

const PumberDetail = ({ navigation }) => {
  const [value, setValue] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [deviceState, setDeviceState] = useState(false);

  const deviceID = '2720946'; 
  useEffect(() => {
    const getDeviceDetails = async () => {
      const devices = await fetchDevices();
      const specificDevice = devices.find(d => d.adaFruitID === deviceID); 
      if (specificDevice) {
        setDeviceInfo(specificDevice);
        setDeviceState(specificDevice.deviceState === 'ON');
      }
    };
    getDeviceDetails();
  }, []);
  const handleSwitchChange = async (newValue) => {
   
    setDeviceState(newValue);
    await updateDeviceState('2720946', newValue, setDeviceInfo, setDeviceState);  // Pass state setters to the update function

   
  };
  const handleValueChange = (newValue) => {
  
    setValue(newValue);
    return Math.round(newValue/3.6);
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-circle" size={30} />
        </TouchableOpacity>
      </View>
      
     <View style={styles.nav}>
      
      <TouchableOpacity style={styles.block}><MaterialCommunityIcons name="fan" size={40} color="rgba( 255, 140, 0, 1 )" />
<Text style={{color:'rgba( 255, 140, 0, 1 )'}}>Thủ công</Text>

</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('PumberAuto', {name: 'PumberAuto'})} style={styles.block}><MaterialCommunityIcons name="file-cog" size={40} color="rgba( 255, 140, 0, 1 )" />
      <Text style={{color:'rgba( 255, 140, 0, 1 )'}}>Tự động</Text>
      </TouchableOpacity>

      </View >
      <View style={{marginTop:10}} >
      <Text style={ styles.textStyle}>Mã thiết bị:                {deviceInfo ? deviceInfo.adaFruitID : 'Loading...'}</Text>
      <Text style={ styles.textStyle}>Tên thiết bị:               {deviceInfo ? deviceInfo.deviceName : 'Loading...'}</Text>
      <Text style={styles.textStyle}>Trạng thái:  {"              "}

          <Text style={{
           
          color: deviceState ? 'green' : 'red',
          fontWeight: 'bold'
        }}> {deviceState ? 'Đang bật' : 'Đã tắt'}</Text>
      </Text>
      <Text style={ styles.textStyle}>Giá trị:                         {deviceInfo ? deviceInfo.lastValue : 'Loading...'}</Text>
      <Text style={styles.textStyle}>Thời gian cập nhật:  {deviceInfo ? deviceInfo.updatedTime : 'Loading...'}</Text>
   

      </View>
      

      <View style={styles.sliderContainer}>
        {/* Cập nhật CircleSlider sử dụng state và setState */}
        <CircleSlider  strokeWidth='20' dialWidth='20' 	 strokeColor='#808080'  value={value} setValue={value} onValueChange={handleValueChange}    />

 <View style={{ position: 'absolute', top: '30%', left: '42%', transform: [{ translateX: -5 }, { translateY: -15 }] }}>
        <Text style={{ fontSize: 30, color: 'black', textAlign: 'center' }}>Speed</Text>
      </View>

        <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -15 }, { translateY: -15 }] }}>
        <Text style={{ fontSize: 30, color: 'black', textAlign: 'center' }}>{Math.round(value/3.6)}%</Text>
      </View>
      <View style={{marginTop:10}}>
      <Switch value={deviceState} onValueChange={handleSwitchChange}
      trackColor={{false:"#fff", true:"green"}}
      thumbColor="f4f3f4"
      />
    <Text style={{fontWeight: "bold"}}>Turn on </Text>
      </View>
      </View>
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 44,
    width: Dimensions.get('window').width - 44,
    zIndex: 999, 
  },
  sliderContainer: {
    marginTop: 100,
    alignItems: 'center', 
  },
   nav:{
   width:320,
   height:90,
   marginLeft:'auto',
      marginRight:'auto',
      borderRadius:12,
      backgroundColor:'rgba( 255, 140, 0,0.08 )',
  marginTop:90,
flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  block:{
alignItems: 'center',
     justifyContent: 'center'

    
  },
  textStyle:{
    
    fontWeight: 'bold',
    fontSize:17,
    marginTop:10,
    marginLeft:10,
    letterSpacing: 1.0,
  }
});

export default PumberDetail;
