import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import axios from 'axios';
import moment from 'moment'; 
import { apiBaseUrl } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

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

const NOTIFICATION_CATEGORY = {
  success: {
    label: 'Thành công',
    color: 'green',
  },
  info: {
    label: 'Thông tin',
    color: 'blue',
  },
  warning: {
    label: 'Cảnh báo',
    color: 'orange',
  },
  error: {
    label: 'Lỗi',
    color: 'red',
  }
};
const getLabelByType = (type) => {
  return NOTIFICATION_CATEGORY[type]?.label || 'Thông tin'; // Default label if type is not defined
};
const getColorByType = (type) => {
  return NOTIFICATION_CATEGORY[type]?.color || 'gray'; 
};
const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('id');
    console.log("userid: ",userId);
    return userId;
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};
const NotificationService = {
  getAllNotification: async (userId) => {
    await setHeaderRequest();
    try {
      const response = await axios.get(`${apiBaseUrl}/notification/${userId}`);
      return response.data;
    } catch (error) {
      await NotificationService.updateToken();
      throw new Error('Failed to fetch notifications');
    }
  },
  updateToken: async () => {
    await setHeaderRequest();
    try {
      const response = await axios.post(`${apiBaseUrl}/login/updateToken`, {});
      AsyncStorage.setItem('accessToken', response.data.accessToken);
      AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    } catch (error) {
      throw new Error('Failed to update token');
    }
  }
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = await getUserId();
        if (!userId) {
          Alert.alert('Error', 'User ID not found');
          return;
        }
        const data = await NotificationService.getAllNotification(userId);
        setNotifications(data.notifications);
        setFilteredNotifications(data.notifications.slice(0, itemsPerPage));
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to fetch notifications');
      }
    };
    fetchNotifications();
  }, []);
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredNotifications(notifications.slice(startIndex, endIndex));
  }, [currentPage, notifications]);

  const handleSearch = (text) => {
    setSearchValue(text);
    const filtered = notifications.filter(notification =>
      notification.context.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredNotifications(filtered.slice(0, itemsPerPage));
    setCurrentPage(1);
  };
  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchValue}
        onChangeText={handleSearch}
        placeholder="Tìm kiếm thông báo..."
      />
      {filteredNotifications.map((notification, index) => (
        <View key={index} style={[styles.notificationItem, {borderColor: 'black'}]}>
            <FeatherIcon color={getColorByType(notification.notificationType)} name="alert-circle" size={19} />
            <Text style={{ color: getColorByType(notification.notificationType), fontWeight:'bold' }}>
            {getLabelByType(notification.notificationType)}
          </Text>
          <Text style={styles.notificationText}>
            {notification.context} - {moment(notification.createdAt).format('HH:mm DD/MM/YYYY')} 
          </Text>
        </View>
      ))}
      <View style={styles.pagination}>
        <TouchableOpacity onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}>
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{currentPage}</Text>
        <TouchableOpacity onPress={() => setCurrentPage(currentPage + 1)}>
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFF',
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  notificationText: {
    fontWeight:'bold',
    color: 'black',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  pageNumber: {
    color: 'black',
    fontWeight: "bold",
    fontSize:17,
  },
  paginationText: {
    color: 'black',
    fontWeight: "bold",
    fontSize:17,
  },
});

export default Notification;