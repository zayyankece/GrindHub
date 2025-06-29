import React, { useState, useEffect } from 'react';
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

  const [username, setUser] = useState()

  const getUser = async ({username}) => {
    try {
      const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getUser", {
      method : "POST",
      headers : { 'Content-Type': 'application/json' },
      body : JSON.stringify({
      username : username,
      }),
    });
    
    
    const data = await response.json()
    console.log(data)

    if (data.success == false){
      return []
    }
    return data.existingUser

    }
    catch (error){
      console.error(error)
    }
  }

  const [notifications, setNotifications] = useState({
    notifications: true,
    taskDeadline: true,
    lectureClass: true,
    groupMessages: true,
    privateMessages: true
  });

  useEffect(() => {
    // We define an async function inside the effect to perform the fetch.
    const fetchUserData = async () => {

      try {
        // Call your getUser function.
        const fetchedUser = await getUser({ username : "TEST_USER"});

        // If a user is successfully returned, update the states.
        if (fetchedUser) {
          setUser(fetchedUser);

          // IMPORTANT: We are assuming the user object from your API has a
          // property called 'notificationSettings' that contains the user's
          // notification preferences. If the property has a different name,
          // you'll need to change `fetchedUser.notificationSettings` below.

          const notificationSettings = fetchedUser.map(notificationsItems => ({
            notifications: notificationsItems.isnotificationon,
            taskDeadline: notificationsItems.istaskdeadlinenotificationon,
            lectureClass: notificationsItems.islecturenotificationon,
            groupMessages: notificationsItems.isgroupmessagesnotificationon,
            privateMessages: notificationsItems.isprivatemessagesnotificationon
          }))
          if (notificationSettings) {
            setNotifications(notificationSettings[0]);
          } else {
             console.warn("User data fetched, but it does not contain 'notificationSettings'. Using default values.");
          }
        }
      } catch (err) {
        // If an error was thrown during the fetch, we catch it and update the error state.

      } finally {
        // This runs whether the fetch succeeded or failed.
      }
    };

    // Call the async function to start the data fetching process.
    fetchUserData();
  }, []);

  const toggleNotification = (key) => {
    console.log(notifications)
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems = [
    { title: 'Status Message', icon: 'chevron-forward' },
    { title: 'Change Username', icon: 'chevron-forward' }
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
              onPress={() => console.log(notifications)}
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
    backgroundColor: '#FED7AA',
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
    height: 10,
  }
});

export default UserProfile;