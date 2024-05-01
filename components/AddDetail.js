import { View, Text, StyleSheet, TouchableOpacity, Dimensions,TextInput, } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import axios from 'axios'; 
import { Ionicons } from '@expo/vector-icons';

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

const checkFormat = (deviceID) => {
  const regex = /^[0-9]{7}$/;
  return regex.test(deviceID);
};

const addDevice = async (deviceIDs, userId) => {
  await setHeaders();
  try {
    const response = await axios.post(`${apiBaseUrl}/device/add`, {
      userId,
      deviceIDs: deviceIDs.split(',').filter(id => checkFormat(id))
    });
    return response.data;
  } catch (error) {
    console.error('Error adding device:', error);
    Alert.alert("Error", "Failed to add device.");
  }
};

const AddDetail = ({ navigation }) => {
  const [deviceID, setDeviceID] = useState('');


  const handleAddDevice = async () => {
    const userId = await AsyncStorage.getItem('id');
    if (deviceID.split(',').some(id => !checkFormat(id))) {
      Alert.alert("Invalid ID", "One or more device IDs are invalid.");
      return;
    }
    await addDevice(deviceID, userId);
    setDeviceID('');
    Alert.alert("Success", "Device(s) added successfully.");
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
      
      <Text style={styles.header} >Thêm thiết bị</Text>

      </View >
      
     <View style={styles.nguong}> 
     <View style={styles.formBox}>
          <Text style={styles.label}>Nhập Id thiết bị, muốn thêm nhiều thiết bị, nhập cách nhau dấu phẩy:</Text>
          <View style={styles.inputArea}>
            <TextInput
               style={styles.input}
               placeholderTextColor={"#A2A2A2"}
               placeholder="Nhập Id thiết bị"
               value={deviceID}
              onChangeText={setDeviceID}
            />
          </View>
        


          <TouchableOpacity style={styles.loginButton} onPress={handleAddDevice} activeOpacity={0.9} >
            <Text style={styles.loginButtonText}>Thêm thiết bị</Text>
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
    marginTop: 20,
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

export default AddDetail;
