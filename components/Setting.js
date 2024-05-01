import React, { useState,useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,TextInput,
  Image,
} from 'react-native';
import { apiBaseUrl } from '../config';
import axios from 'axios';
import COLORS from './colors';
import { Ionicons } from "@expo/vector-icons";
import FeatherIcon from 'react-native-vector-icons/Feather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function Setting({navigation}) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [username, setUsername] = useState('Nguyễn Minh Toàn');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('0392123451');
  const [newPassword, setNewPassword] = useState('');
  const [verPassword, setVerPassword] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const authHeaders = {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`,
      };

      axios({
        method: 'GET',
        headers: authHeaders,
        url: `${apiBaseUrl}/user`,
        responseType: 'json',
      })
      .then(response => {
        if (response.status === 200) { 
          setEmail(response.data.user.email);
          setUsername(response.data.user.name);
          setPhone(response.data.user.phoneNumber);
        }
      })
      .catch(error => {
        if (error.response) {
          Alert.alert("Error", error.response.data.message);
        }
      });
    };

    fetchData();
  }, []);
  const saveProfile = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    let data = {
      name: username,
      phoneNumber: phone,
    };

    if (newPassword && newPassword === verPassword) {
      data.password = verPassword;
    }

    axios({
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      },
      url: `${apiBaseUrl}/user`,
      data: data,
      responseType: 'json'
    }).then(response => {
      if (response.status === 200) {
        console.log('Profile updated successfully');
      }
    }).catch(error => {
      console.log(error);
      if (error.response) {
        console.log('Error updating profile:', error.response.data.message);
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Thông tin

</Text>

          
        </View>

        <ScrollView>
          <View style={styles.profile}>
            <Image
              alt=""
              source={{
                uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
              }}
              style={styles.profileAvatar} />

            <Text style={styles.profileName}>{username}</Text>

            <Text style={styles.profileEmail}></Text>

            <TouchableOpacity
              onPress={() => {
                onPress={saveProfile}
              }}>
              <View style={styles.profileAction}>
                <Text style={styles.profileActionText}>Xác nhận</Text>

                <FeatherIcon color="#fff" name="edit" size={16} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}></Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                    
                  <View
                    style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="user"
                      size={20} />
                  </View>
                  <TextInput
          style={styles.inputs}
          placeholder="Họ và tên"
         
          underlineColorAndroid="transparent"
          value={username}
          onChangeText={setUsername}

        />
                 

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}></Text>

                 
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                 
                  style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="mail"
                      size={20} />
                  </View>

                  <TextInput
          style={styles.inputs}
          placeholder="Email"
         
          underlineColorAndroid="transparent"
          value={email}
          editable={false}

        />

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}></Text>

                  
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: '#007AFF' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="phone"
                      size={20} />
                  </View>

                  <TextInput
          style={styles.inputs}
          placeholder="Phone"
          
          underlineColorAndroid="transparent"
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'

        />

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}></Text>
                  
                </View>
              </View>

              <View style={styles.rowWrapper}>
                <TouchableOpacity
                 
                  style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="key"
                      size={20} />
                  </View>

                  <TextInput
          style={styles.inputs}
          placeholder="Nhập mật khẩu mới hoặc để trống!"
          onChangeText={setNewPassword}
          underlineColorAndroid="transparent"
          value={newPassword}
          secureTextEntry={isPasswordShown}

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
 
                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}></Text>

                  
                </TouchableOpacity>
              </View>
              
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                 
                  style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="key"
                      size={20} />
                  </View>

                  <TextInput
          style={styles.inputs}
          placeholder="Nhập lại mật khẩu mới"
          onChangeText={setVerPassword}
          underlineColorAndroid="transparent"
          value={verPassword}
          secureTextEntry={isPasswordShown}
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
                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}></Text>

                  
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Help', { name: 'Help' }); 
                  }}
                  style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: 'black' }]}>
                   
                      <MaterialCommunityIcons name="help-circle" size={20} color="#fff" />

                  </View>

                  <Text style={styles.rowLabel}>Trợ giúp</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}></Text>

                  <FeatherIcon
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Login', { name: 'Login' }); 
                  }}
                  style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: '#FF0000' }]}>
                   
                      <MaterialCommunityIcons name="logout" size={20} color="#fff" />

                  </View>

                  <Text style={styles.rowLabel}>Đăng xuất</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}></Text>

                  <FeatherIcon
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>
              </View>
           
            </View>

           
          </View>

          <Text style={styles.contentFooter}></Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },

  profile: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },

  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionBody: {
    paddingLeft: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
    height: 50,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8B8B8B',
    marginRight: 4,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
});