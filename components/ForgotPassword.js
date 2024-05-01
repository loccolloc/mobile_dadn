
import {

  StyleSheet,
View,SafeAreaView,TouchableOpacity,Text,TextInput,
  Dimensions,Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import  { useState } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../config';
const validateEmail = (email) => {
  const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
  return emailPattern.test(email);
};

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [sendOtp, setSendOtp] = useState(false);
  const [message, setMessage] = useState('');
  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
    } else {
      setMessage('Processing...');
      try {
        const response = await axios.post(`${apiBaseUrl}/gen/otp/${email}`, {}, { responseType: 'json' });
        setSendOtp(true);
        setMessage('We have sent an OTP to your email. Please check your inbox (including spam folder).');
      } catch (error) {
        setSendOtp(false);
        setMessage('Failed to send OTP. Please try again.');
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
       <View style={styles.upperRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons  color='white' name="chevron-back-circle" size={30} />
        </TouchableOpacity>
      </View>

        <View style={styles.logoArea}>
   
          <Text style={styles.logoName}>Smart Farm</Text>

          <Text style={styles.forgotPasswordHeadText}>Quên mật khẩu?</Text>
          <Text style={styles.forgotPasswordSubText}>
          Hãy nhập địa chỉ email bạn đã dùng để tạo tài khoản, chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
          </Text>
        </View>

        <View style={styles.formBox}>
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.inputArea}>
            <TextInput
               style={styles.input}
               placeholderTextColor={"#A2A2A2"}
               placeholder="Nhập email ở đây"
               value={email}
               onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.9} onPress={handleSendOtp}>
            <Text style={styles.loginButtonText}>Gửi EMAIL</Text>
          </TouchableOpacity>
          {message !== '' && (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
  logoArea: {
    height: 420,
    justifyContent: "center",
    alignItems: "center",
  },

  logoName: {
    color: "#5A611E",
    marginTop: 10,
    fontSize: 60,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  forgotPasswordHeadText: {
    marginTop: 35,
    fontWeight: "bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  forgotPasswordSubText: {
    width: 250,
    marginTop: 14,
    textAlign: "center",
    color: "#BFBFBF",
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
    color: "white",
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
  message:{
    marginTop:'10px',
    color:"white",
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
});