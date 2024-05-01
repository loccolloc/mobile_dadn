import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Stack = createNativeStackNavigator();
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Setting from './components/Setting';
import Datalog from './components/Datalog';
import LightDetail from './components/LightDetail';
import PumberDetail from './components/PumberDetail';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TemperatureDetail from './components/TemperatureDetail';
import MoistureDetail from './components/MoistureDetail';
import LightIntensityDetail from './components/LightIntensityDetail';
import Notification from './components/Notification';
import PumberAuto from './components/PumberAuto';
import SensorDetail from "./components/SensorDetail"
import LightAuto from './components/LightAuto';
import ForgotPassword from './components/ForgotPassword';
import AirHumidityDetail from './components/AirHumidityDetail';
import AddDetail  from './components/AddDetail';
import Help  from './components/Help';
const Tab = createBottomTabNavigator();

const HomePage = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Datalog"
        component={Datalog}
        options={{
          title: 'Datalog',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={size}
              color={color}
            />
          ),
        }}></Tab.Screen>

      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Notification',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          title: 'Setting',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}></Tab.Screen>
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="LightDetail" component={LightDetail} />
        <Stack.Screen name="PumberDetail" component={PumberDetail} />
        <Stack.Screen name="PumberAuto" component={PumberAuto} />
        <Stack.Screen name="LightAuto" component={LightAuto} />
        <Stack.Screen name="SensorDetail" component={SensorDetail} />
        <Stack.Screen name="TemperatureDetail" component={TemperatureDetail} />
        <Stack.Screen name="MoistureDetail" component={MoistureDetail} />
        <Stack.Screen name="AddDetail" component={AddDetail} />
        <Stack.Screen name="Help" component={Help} />
           <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
           <Stack.Screen name="AirHumidityDetail" component={AirHumidityDetail} />

        <Stack.Screen
          name="LightIntensityDetail"
          component={LightIntensityDetail}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
