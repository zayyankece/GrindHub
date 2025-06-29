import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GrindHubFooter = ({ navigation, activeTab, token }) => {
    console.log("haha")
    console.log(token)
    const getIconColor = (tabName) => {
      return activeTab === tabName ? 'yellow' : 'white';
    };
  
    return (
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate("HomePage", { token: token })}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={getIconColor("HomePage")}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate("GroupChat", { token: token })}
        >
          <Ionicons 
            name="people" 
            size={24} 
            color={getIconColor("GroupChat")} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate("Timetable", { token: token })}
        >
          <Ionicons 
            name="calendar" 
            size={24} 
            color={getIconColor("Timetable")} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons 
            name="time" 
            size={24} 
            color={getIconColor("TimeTracker")} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons 
            name="bag" 
            size={24} 
            color={getIconColor("Bag")} 
          />
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#FF8400',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default GrindHubFooter