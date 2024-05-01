import { Alert,View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from './colors';
import { Ionicons } from "@expo/vector-icons";

import Button from './Button';

import axios from 'axios';
import { apiBaseUrl } from '../config';
const validateEmail = (email) => {
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    return emailPattern.test(email);
  };
const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [sendOtp, setSendOtp] = useState(false);
    const resendOtp = async () => {
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
            console.log("loi resendOtp",error);
            setMessage('Failed to send OTP. Please try again.');
            Alert.alert('Error', message);
          }
        }
      };
      const handleSubmitValid = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
        } else if (password !== passwordConfirm) {
            Alert.alert('Error', 'Passwords do not match.');
        } else if (!validatePassword(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters including a number and a special character.');
        } else {
            try {
                const response = await axios.post(`${apiBaseUrl}/reset`, {
                    email,
                    password,
                    otp
                }, { responseType: 'json' });
                setMessage(response.data.message);
                Alert.alert('Success', message);
            } catch (error) {
                console.log("loi handleSubmitValid",error);

                setMessage('Failed to reset password. Please try again.');
                Alert.alert('Error', message);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
Xác thực tài khoản và đổi mật khẩu
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}></Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email </Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                        onChangeText={setEmail}
                            value={email}
                            placeholder='Email'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>

              

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Nhập mật khẩu mới:

                    </Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                        onChangeText={setPassword}
                        value={password}
                            placeholder='Nhập mật khẩu mới!'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Nhập lại mật khẩu:

                    </Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                        onChangeText={setPasswordConfirm}
                        value={passwordConfirm}
                            placeholder='Nhập lại mật khẩu mới'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Mã OTP:


                    </Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                        onChangeText={setOtp}
                        value={otp}
                            placeholder='OTP'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

              

                <Button onPress={handleSubmitValid}
                    title="Xác nhận"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}></Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                  
                    <TouchableOpacity
                        onPress={resendOtp}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                       

                        <Text>Gửi OTP</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Đã có tài khoản</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Đăng nhập</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Signup