import { View, Text, StyleSheet, TouchableOpacity, Dimensions,Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios'; 
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiBaseUrl } from '../config';
import TimeScheduleLight from './TimeScheduleLight'; 

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
async function updateDeviceInfo(deviceID, schedule) {
  await setHeaders();
  try {
    const response = await axios.patch(`${apiBaseUrl}/device/${deviceID}/updateInfo`, {
      schedule: schedule
    });
    console.log("Update successful:", response.data);
    Alert.alert("Trạng thái cập nhật", "Cập nhật lịch thành công!");
  } catch (error) {
    console.error("Update failed:", error);
    Alert.alert("Trạng thái cập nhật", "Cập nhật lịch thất bại.");
  }
}
const PumberAuto = ({ navigation }) => {
  
  const [deviceInfo, setDeviceInfo] = useState(null);

  const [schedule, setSchedule] = useState([]);

  const deviceID = '2720945'; 
  useEffect(() => {
    const getDeviceDetails = async () => {
      const devices = await fetchDevices();
      const specificDevice = devices.find(d => d.adaFruitID === deviceID); 
      if (specificDevice) {
       
      
        console.log("schedule: ",specificDevice.schedule);
        setDeviceInfo(specificDevice);
        setSchedule(specificDevice.schedule);
       
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
      
      <TouchableOpacity  onPress={() => {
            navigation.goBack();
          }} style={styles.block}><MaterialCommunityIcons name="braille" size={40} color="rgba( 255, 140, 0, 1 )" />
<Text style={{color:'rgba( 255, 140, 0, 1 )'}}>Thủ công</Text>

</TouchableOpacity>
<TouchableOpacity style={styles.block}><MaterialCommunityIcons name="file-cog" size={40} color="rgba( 255, 140, 0, 1 )" />
      <Text style={{color:'rgba( 255, 140, 0, 1 )'}}>Tự động</Text>
      </TouchableOpacity>

      </View >
   
      <View>
        
        <View style={styles.header}>
        <Text style={styles.headerText}>Tự động bật</Text>

        </View>
        
       
 
<TimeScheduleLight schedule={schedule} setSchedule={setSchedule} />
      </View>
      
        <TouchableOpacity style={styles.loginButton} onPress={() => updateDeviceInfo(deviceID, schedule)}  activeOpacity={0.9} >
            <Text style={styles.loginButtonText}>Lưu</Text>
          </TouchableOpacity>
   
      
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
      backgroundColor:'rgba( 255, 140, 0,0.08 )',
  marginTop:90,
flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  block:{
alignItems: 'center',
     justifyContent: 'center'

    
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
    marginTop:20,
    marginLeft:150,
     
  },
  headerText:{
    fontSize: 25,
    fontWeight: "bold",
  }

});

export default PumberAuto;
