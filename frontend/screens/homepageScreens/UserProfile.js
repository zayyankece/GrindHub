import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubHeader from './components/GrindHubHeader';
import GrindHubFooter from './components/GrindHubFooter';

const UserProfile = ({navigation}) => {
  const [notifications, setNotifications] = useState({
    notifications: true,
    taskDeadline: true,
    lectureClass: false,
    groupMessages: true,
    privateMessages: false
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems = [
    { title: 'Status Message', icon: 'chevron-forward' },
    { title: 'Study Icon Settings', icon: 'chevron-forward' },
    { title: 'Category', icon: 'chevron-forward' }
  ];

  const notificationItems = [
    { key: 'notifications', title: 'Notifications' },
    { key: 'taskDeadline', title: 'Task Deadline' },
    { key: 'lectureClass', title: 'Lecture / Class' },
    { key: 'groupMessages', title: 'Group Messages' },
    { key: 'privateMessages', title: 'Private Messages' }
  ];

  const ToggleSwitch = ({ isOn, onToggle }) => (
    <TouchableOpacity
      style={[
        styles.toggleSwitch,
        { backgroundColor: isOn ? '#FF8C42' : '#9CA3AF' }
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX: isOn ? 20 : 2 }] }
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      {/* Header */}
      <GrindHubHeader navigation={navigation}/>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profilePicture} />
          <Text style={styles.username}>im_a_user</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name={item.icon} size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification Settings */}
        <View style={styles.card}>
          {notificationItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.notificationItem,
                index !== notificationItems.length - 1 && styles.notificationItemBorder
              ]}
            >
              <Text style={styles.notificationText}>{item.title}</Text>
              <ToggleSwitch
                isOn={notifications[item.key]}
                onToggle={() => toggleNotification(item.key)}
              />
            </View>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutCard} activeOpacity={0.7}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <GrindHubFooter navigation={navigation} activeTab="HomePage"/>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4F46E5',
    marginBottom: 16,
    // Gradient effect simulation
    borderWidth: 3,
    borderColor: '#06B6D4',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 18,
    color: '#374151',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  notificationItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationText: {
    fontSize: 18,
    color: '#374151',
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  signOutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  signOutText: {
    fontSize: 18,
    color: '#374151',
  },
  bottomSpacing: {
    height: 80,
  }
});

export default UserProfile;