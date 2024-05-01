import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StackedBarChart,
  ChartType,
} from "@tanmaya_pradhan/react-native-charts";

import axios from "axios";
import { apiBaseUrl } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const setHeaders = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  if (refreshToken) {
    axios.defaults.headers.common["Refresh-Token"] = `Bearer ${refreshToken}`;
  } else {
    delete axios.defaults.headers.common["Refresh-Token"];
  }
};

const LightIntensityDetail = ({ navigation }) => {
  const [devices, setDevice] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [minTemp, setMinTemp] = useState(0);
  const [maxTemp, setMaxTemp] = useState(0);
  const [avgTemp, setAvgTemp] = useState(0);

  useEffect(() => {
    setHeaders();
    getDeviceState();
  }, []);

  async function getDeviceState() {
    try {
      const response = await axios.get(`${apiBaseUrl}/device/getall`);

      const temperatureDevice = response.data.devices.find(
        (device) => device.deviceName === "light"
      );
      const environmentValue = temperatureDevice.environmentValue;
      const last17Values = environmentValue.slice(-17);
      const values = last17Values
        .map((item) => parseFloat(item.value))
        .filter(isFinite);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const averageValue =
        values.reduce((acc, cur) => acc + cur, 0) / values.length;

      setMinTemp(minValue);
      setMaxTemp(maxValue);
      setAvgTemp(averageValue.toFixed(2));

      const middleIndex = Math.floor(last17Values.length / 2);
      const chartData = last17Values.map((item, index) => {
       
        const parts = item.createdTime.match(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+) (\w+)/);
        if (!parts) {
          console.error('Failed to parse date:', item.createdTime);
          return null;
        }
      
        const [, month, day, year, hour, minute, second, period] = parts;
        const hour24 = period === 'PM' ? parseInt(hour) % 12 + 12 : parseInt(hour);
        let  formattedTime = `${hour24}:${minute}:${second}`;
       

        if (index !== 0 && index !== middleIndex && index !== last17Values.length - 1) {
          formattedTime = ""; 
        }
        const value = parseFloat(item.value);
        if (!isFinite(value)) {
          console.error('Invalid value:', item.value);
          return null;
        }
       
        return {
          barValues: [value],
          month: formattedTime,   
         
        };
      }).filter(Boolean); 
     
      setChartData(chartData);
  
      
      const lastValue = environmentValue[environmentValue.length - 1].value;
      setDevice(lastValue);
    } catch (error) {}
  }
  return (
    <View style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back-circle" size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.circle}>
        <Text style={styles.text}>{devices} Lux</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold" }}>Min: {minTemp}</Text>
        </View>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold" }}>Max: {maxTemp}</Text>
        </View>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold" }}>AVG: {avgTemp}</Text>
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: 55 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
        Cường độ ánh sáng
          
        </Text>
      </View>
      <View style={{ marginTop: 5 }}>
      <StackedBarChart
          containerHeight={400}
          backgroundColor="#e7e7e7"
          yAxisSubstring="Lux"
          y2AxisSubstring=""
          showGridX={true}
          showGridY={true}
         
          axisFontColor="black"
          chartColors={["#fdfa72", "#fdfa72"]}
          barWidth="20"
          chartType={ChartType.BAR}
          y2Axis={false}
          chartData={chartData}
          showTooltipPopup={false}
          onPressLineItem={(item) => console.log(item)}
          scrollEnable={true}
          multiLineChartColors={['red', 'blue']}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 44,
    width: Dimensions.get("window").width - 44,
    zIndex: 999,
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 250,
    backgroundColor: "#fffd8d",
    marginTop: 130,
    marginLeft: "auto",
    marginRight: "auto",

    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    color: "#000",
    fontWeight: "bold",
  },
  row: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
  },
  box: {
    minWidth: 110,
    padding: 10,
    marginRight: 2,
    borderRadius: 15,
    height: 50,
    width: 70,
    backgroundColor: "rgba( 255, 215, 0, 0.05 )",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LightIntensityDetail;
