
import {View, Text, StyleSheet,Switch,Image} from 'react-native';

import PumberView from './PumberView';
import LightView from './LightView';
import SensorView from './SensorView';
import AddView from './AddView';

const Footer = () => {
  return (
    <View style={styles.container}>
    
    <PumberView>    </PumberView>

  <LightView>  </LightView>
<SensorView></SensorView>
<AddView></AddView>
            </View>



  );
};
const styles= StyleSheet.create({
  container:{
    width:'100%',
    height:'50%',
    padding:5,
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop:7

  },
  


});

export default Footer;