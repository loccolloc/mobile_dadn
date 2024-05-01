import { View, Text, StyleSheet, TouchableOpacity, Dimensions,TextInput, } from 'react-native';
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
    
    return response.data.devices; 
  } catch (error) {
    console.error("Failed to fetch devices:", error);
    Alert.alert("Error", "Failed to fetch devices.");
    return [];
  }
}

async function updateDeviceLimits(deviceID, minLimit, maxLimit, setDeviceInfo) {
  await setHeaders(); 
  try {
    const response = await axios.patch(`${apiBaseUrl}/device/${deviceID}/updateInfo`, {
      minLimit: minLimit,
      maxLimit: maxLimit
    });
   
    if (response.data && response.data.device) {
      setDeviceInfo(response.data.device);
      Alert.alert("Success", "Limits updated successfully.");
    }
  } catch (error) {
    alert("Error", error.message || "An error occurred");
    console.log("Error log:", error);
  }
}

const PumberDetail = ({ navigation }) => {
 
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [deviceState, setDeviceState] = useState(false);
  const [minLimit, setMinLimit] = useState('');
  const [maxLimit, setMaxLimit] = useState('');
  const deviceID = '2720939'; 
  useEffect(() => {
    const getDeviceDetails = async () => {
      const devices = await fetchDevices();
      const specificDevice = devices.find(d => d.adaFruitID === deviceID); 
      if (specificDevice) {
        setDeviceInfo(specificDevice);
        setMinLimit(specificDevice.minLimit.toString());
        setMaxLimit(specificDevice.maxLimit.toString());
      }
    };
    getDeviceDetails();
  }, []);
  
 
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
      
      <Text style={styles.header} >Cảm biến độ ẩm đất</Text>

      </View >
      <View style={{marginTop:0}} >
      <Text style={ styles.textStyle}>Mã thiết bị:                {deviceInfo ? deviceInfo.adaFruitID : 'Loading...'}</Text>
      <Text style={ styles.textStyle}>Tên thiết bị:               {deviceInfo ? deviceInfo.deviceName : 'Loading...'}</Text>
      <Text style={styles.textStyle}>Trạng thái:  {"              "}

          <Text style={{
           
          color: deviceState ? 'green' : 'red',
          fontWeight: 'bold'
        }}> {deviceState ? 'Đang bật' : 'Đã tắt'}</Text>
      </Text>
      <Text style={ styles.textStyle}>Giá trị:                         {deviceInfo ? deviceInfo.lastValue : 'Loading...'}%</Text>
      <Text style={styles.textStyle}>Thời gian cập nhật:  {deviceInfo ? deviceInfo.updatedTime : 'Loading...'}</Text>
   

      </View>
     <View style={styles.nguong}> 
     <View style={styles.formBox}>
          <Text style={styles.label}>Ngưỡng dưới:</Text>
          <View style={styles.inputArea}>
            <TextInput
               style={styles.input}
               placeholderTextColor={"#A2A2A2"}
               placeholder="Nhập ngưỡng dưới"
               value={minLimit}
            onChangeText={setMinLimit}
            keyboardType="numeric"
            />
          </View>
          <Text style={styles.label}>Ngưỡng trên:</Text>
          <View style={styles.inputArea}>
            <TextInput
               style={styles.input}
               placeholderTextColor={"#A2A2A2"}
               placeholder="Nhập ngưỡng trên"
               value={maxLimit}
            onChangeText={setMaxLimit}
            keyboardType="numeric"
            />
          </View>


          <TouchableOpacity style={styles.loginButton}  onPress={() => updateDeviceLimits(deviceID, parseInt(minLimit), parseInt(maxLimit), setDeviceInfo)} activeOpacity={0.9} >
            <Text style={styles.loginButtonText}>Lưu</Text>
          </TouchableOpacity>
          {/* {message !== '' && (
            <Text style={styles.message}>{message}</Text>
          )} */}
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
  
   nav:{
   width:320,
   height:90,
   marginLeft:'auto',
      marginRight:'auto',
      borderRadius:12,
      backgroundColor:'none',
  marginTop:100,
flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
 
  textStyle:{
    
    fontWeight: 'bold',
    fontSize:17,
    marginTop:10,
    marginLeft:10,
    letterSpacing: 1.0,
  },
  formBox: {
    zIndex: 10,
    marginTop: -50,
    alignSelf: "center",
    width: 360,
    height: 200,
    padding: 10,
  },
  label: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
  },
  inputArea: {
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 8,
    height: 40,
    color: "white",
    backgroundColor: "#212121",
  },
  input: {
    width: 280,
    height: 40,
    padding: 10,
    paddingBottom: 13,
    color: "white",
    fontSize: 17,
    backgroundColor: "#212121",
    marginLeft: 10,
  },
  nguong:{
    marginTop:70,
  },
  loginButton: {
    marginTop: 12,
    width: "100%",
    borderRadius: 8,
    height: 50,
    backgroundColor: "#FFBB3B",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  header:{
    fontSize: 30,
    fontWeight: "bold",
  }
});

export default PumberDetail;
