import {StyleSheet, StatusBar,ImageBackground} from 'react-native';
import Blue from '../assets/Blue.webp';
import TemperatureView from './TemperatureView';
import HumidityView from './HumidityView';
import LightIntensityView from './LightIntensityView';
import AirHumidityView from './AirHumidityView';

const Datalog = () => {
  return (
    <ImageBackground source={Blue}  style={styles.container}>
    
   
      <TemperatureView> </TemperatureView>
      <HumidityView> </HumidityView>
      <AirHumidityView></AirHumidityView>
      <LightIntensityView></LightIntensityView>
      
        </ImageBackground>


  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    
    
  },

});

export default Datalog;