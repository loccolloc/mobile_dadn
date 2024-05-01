import  { useState, useRef,useEffect  } from 'react';
import { View,Switch,Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import ColorPicker from 'react-native-wheel-color-picker';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios'; 
import { apiBaseUrl } from '../config';

const colorMap = {
  '#ed1c23': 'red',
  '#f26321': 'orange',
  '#ffdc16': 'yellow',
  '#57ff0a': 'green',
  '#00c65c': 'green',
  '#1632e5': 'blue',
  '#00afef': 'blue',
  '#d31bd6': 'purple',
  '#FFC0CB': 'pink',
  '#ffffff': 'white',
  '#000000': 'black'  
};
const colorMap3 = {
  '#ed1c23': 'Đỏ',
  '#f26321': 'Cam',
  '#ffdc16': 'Vàng',
  '#57ff0a': 'Xanh lá',
  '#00c65c': 'Xanh lá',
  '#1632e5': 'Xanh dương',
  '#00afef': 'Xanh dương',
  '#d31bd6': 'Tím',
  '#FFC0CB': 'Hồng',
  '#ffffff': 'Trắng',
  '#000000': 'Đen'  
};
const colorMap2 = {
  'red': '#ed1c23',
  'orange': '#f26321',
  'yellow': '#ffdc16',
  'green': '#57ff0a',
  'green': '#00c65c',
  'blue': '#1632e5',
  'blue': '#00afef',
  'purple': '#d31bd6',
  'pink': '#FFC0CB',
  'white': '#ffffff',
  'black': '#000000'
};
function getColorName(hexCode) {
 
  return colorMap[hexCode] || 'Unknown';  
}
function getColorNameVietnam(hexCode) {
 
  return colorMap3[hexCode] || 'Unknown';  
}
function getHexName(hexCode) {
 
  return colorMap2[hexCode] || 'Unknown';  
}
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
    
      setDeviceInfo(response.data.device);
      setDeviceState(response.data.device.deviceState === 'ON');
    }
  } catch (error) {
    // alert("Báo lỗi", error.message || "An error occurred");
    // console.log("log lỗi", error);
  }
}


const LightDetail = ({ navigation }) => {
  const [color, setColor] = useState(getHexName("black"));
  const [swatchesOnly, setSwatchesOnly] = useState(false);
  const [swatchesLast, setSwatchesLast] = useState(true);
  const [swatchesEnabled, setSwatchesEnabled] = useState(true);
  const [disc, setDisc] = useState(false);
  const [deviceState, setDeviceState] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const deviceID = '2720945'; 
  useEffect(() => {
   
    const getDeviceDetails = async () => {
      const devices = await fetchDevices();
      const specificDevice = devices.find(d => d.adaFruitID === deviceID); 
      if (specificDevice) {
        setDeviceInfo(specificDevice);
        setDeviceState(specificDevice.deviceState === 'ON');
        const initialColor = colorMap2[specificDevice.color] || specificDevice.color;
        setColor(initialColor);
        console.log("mau: ",initialColor);
      }
    };
    getDeviceDetails();
  }, []);

  const handleSwitchChange = async (newValue) => {
   
    setDeviceState(newValue);
    await updateDeviceState('2720945', newValue, setDeviceInfo, setDeviceState); 
   

 
  };
  const pickerRef = useRef(null);
  async function updateDeviceInfo(deviceID, color) {
    await setHeaders();
    const colorName = getColorName(color);
    try {
      const response = await axios.patch(`${apiBaseUrl}/device/${deviceID}/updateInfo`, {
        color: colorName
      });
      console.log("Cập nhật màu đèn thành công:");
      Alert.alert("Trạng thái cập nhật", "Cập nhật màu đèn thành công!");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Cập nhật thất bại", "Cập nhật màu đèn thất bại.");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.nav}>
      <TouchableOpacity style={styles.block}><MaterialCommunityIcons name="braille" size={40} color="rgba( 255, 140, 0, 1 )" />
<Text style={{color:'rgba( 255, 140, 0, 1 )'}}>Thủ công</Text>

</TouchableOpacity>
      <TouchableOpacity style={styles.block}><MaterialCommunityIcons onPress={() => navigation.navigate('LightAuto', {name: 'LightAuto'})} name="file-cog" size={40} color="rgba( 255, 140, 0, 1 )" />
      <Text style={{color:'rgba( 255, 140, 0, 1 )'}}>Tự động</Text>
      </TouchableOpacity>

      </View>
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
      <Text style={styles.textStyle}>Màu: <Text style={{color:color, fontWeight: 'bold',
    fontSize:17, letterSpacing: 1.0, }}>{getColorNameVietnam(color)}</Text> </Text>


      </View>
      
      <View style={{marginTop:10, paddingLeft:20, paddingRight:20}}>
        <ColorPicker
          ref={pickerRef}
          color={color}
          swatchesOnly={swatchesOnly}
          onColorChange={setColor}
          onColorChangeComplete={setColor}
          thumbSize={40}
          sliderSize={40}
          noSnap={true}
          row={false}
          swatchesLast={swatchesLast}
          swatches={swatchesEnabled}
          discrete={disc}
          sliderLoadingIndicator={<ActivityIndicator size={20} />}
          wheelLoadingIndicator={<ActivityIndicator size={40} />}
          useNativeDriver={false}
          useNativeLayout={false}
        />
        
      </View>
      <View style={{marginTop:320, alignItems: 'center',}}>
      <Switch value={deviceState} onValueChange={handleSwitchChange}
      trackColor={{false:"#fff", true:"green"}}
      thumbColor="f4f3f4"
      />
      <Text style={{fontWeight: "bold"}}>Bật </Text>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={() => updateDeviceInfo(deviceID, color)}  activeOpacity={0.9} >
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
    zIndex: 999,
    width: Dimensions.get('window').width - 44, 
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
    marginTop:12,
    marginLeft:14,
    letterSpacing: 1.0,
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
});

export default LightDetail;
