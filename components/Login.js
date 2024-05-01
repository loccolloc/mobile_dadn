import React, { useState,createContext, useContext } from 'react'; 
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { HttpStatusCode } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiBaseUrl } from '../config';


const validateEmail = (email) => {
  const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
  return emailPattern.test(email);
};



const validatePassword = (password) => {
  const lengthCheck = password.length >= 8;
    const charCheck = /[a-zA-Z]/.test(password);
    const numCheck = /\d/.test(password);
    const specialCharCheck = /[!@#$%^&*()-_=+]/.test(password);
    return lengthCheck && charCheck && numCheck && specialCharCheck;
};







const UserInfoContext = createContext();

export const useUserInfoStore = () => useContext(UserInfoContext);

const setHeaderRequest = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (accessToken && refreshToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    axios.defaults.headers.common['Refresh-Token'] = `Bearer ${refreshToken}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Refresh-Token'];
  }
};



export default Login = ({navigation}) => {
  
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [block, setBlock] = useState(false);
  

  const handleSignIn = async () => {
    if (!validateEmail(username)) {
      Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
    } else if (!validatePassword(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and contain at least one letter, one number, and one special character.'
      );
    } else {
      setBlock(true);
      try {
        const response = await axios.post(`${apiBaseUrl}/login`, {
          email: username,
          password: password,
        }, { responseType: 'json' });

        if (response.status === HttpStatusCode.Ok) {
          await AsyncStorage.setItem('accessToken', response.data.accessToken);
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          await AsyncStorage.setItem('id', response.data.userInfo.id.toString()); 

          setHeaderRequest();
          navigation.navigate('HomePage', { name: 'HomePage' }); 
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === HttpStatusCode.BadRequest ||
            error.response.status === HttpStatusCode.Unauthorized ||
            error.response.status === HttpStatusCode.InternalServerError)
        ) {
          Alert.alert('Login Error', error.response.data.message || 'An error occurred during login.');
        } else {
          Alert.alert('Network Error', 'Unable to connect to the server.');
        }
      } finally {
        setBlock(false);
      }
    }
  };

  return (
    
    <View style={styles.container}>
     
      <Image
        style={styles.bgImage}
        source={require('../assets/TractorFarm_Lead.jpg')}
      />
      <Text style={styles.textStyle}>Smart Farm</Text>
      <View style={styles.inputContainer}>
     
        <TextInput
          style={styles.inputs}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={(email) => setUsername(email)} 
        />
        <Image
          style={styles.inputIcon}
          source={require('../assets/email.png')}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          onChangeText={(password) => setPassword(password)}
        />
        <Image
          style={styles.inputIcon}
          source={require('../assets/key.png')}
        />
      </View>

      <TouchableOpacity 
        style={styles.btnForgotPassword}
        onPress={() => navigation.navigate('ForgotPassword', {name: 'ForgotPassword'})}>
        <Text style={styles.btnText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      

      <TouchableOpacity
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={handleSignIn}
        disabled={block}>
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Signup', {name: 'Signup'})}>
        <Text style={styles.btnText}>Xác thực tài khoản</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#808080',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  btnForgotPassword: {
    height: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 10,
    width: 300,
    backgroundColor: 'transparent',
  },
  loginButton: {
    backgroundColor: '#00b5ec',

    shadowColor: '#808080',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: 'white',
    fontWeight:'bold',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textStyle:{
    color:'#5A611E',
    fontWeight: 'bold',
    fontSize:60,
   marginBottom:230,
    letterSpacing: 1.1,
  }
})

                                  