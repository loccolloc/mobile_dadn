

import {View, Text, StyleSheet,Image} from 'react-native';
import Sun from '../assets/sun.png';
import Farm from '../assets/farm.png';





const Header = () => {
  const now = new Date();

const date = now.getDate();


const month = now.getMonth() + 1; 


const year = now.getFullYear();


  return (
    <View style={styles.header}>
    <View style={styles.container}>
    
    
  <View style={styles.box}>
    <View style={styles.inner}>
    <Image source={Sun} style={{width:150, height:150}}/>
        </View>
  </View>
  <View style={styles.box3}>
    <View style={styles.inner}>
    
      <Text  style={styles.textStyle}>Hôm nay {`${date}/${month}/${year}`}</Text>
        </View>
  </View>

            </View>

        </View>


  );
};
const styles= StyleSheet.create({
  header:{
      width:'100%',
      height:'20%',
      alignItems:'center',
      justifyContent:'center',
     
 
  },
   container:{
    width:'100%',
    height:'80%',
    padding:5,
    flexDirection:'row',
    flexWrap:'wrap',
   

  },
  box:{
      width:'50%',
      height:'50%',
     padding:5,

  },

box3:{
  width:'50%',
  height:'50%',
 padding:5,
 marginTop:5,

},

  inner:{

    flex:1,
    // backgroundColor:'#eee',
    alignItems:'center',
    justifyContent:'center',
    marginY:10,
  },
  textStyle:{
     
     fontWeight:'bold', 
     fontSize:17,
  }



});

export default Header;