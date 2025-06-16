import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GrindHubHeader = ({ navigation, onProfilePress }) => {
  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else if (navigation) {
      navigation.navigate("UserProfile");
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
        <Image source={require("../../assets/GrindHub Logo White.png")} style={{flex: 1, backgroundColor: "#FF8400"}} resizeMode="contain"/>
        </View>
        <Text style={styles.headerTitle}>GrindHub</Text>
      </View>
      <TouchableOpacity onPress={handleProfilePress}>
        <Ionicons name="person-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FF8400',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      logoContainer: {
        width: 32,
        height: 32,
        backgroundColor: '#EA580C',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
      },
});

export default GrindHubHeader;


// const GrindHubFooter = ({ navigation, activeTab }) => {
//     const getIconColor = (tabName) => {
//       return activeTab === tabName ? '#FF8400' : 'white';
//     };
  
//     return (
//       <View style={styles.bottomNav}>
//         <TouchableOpacity 
//           style={styles.navItem} 
//           onPress={() => navigation.navigate("HomePage")}
//         >
//           <Ionicons 
//             name="home" 
//             size={24} 
//             color={getIconColor("HomePage")}
//           />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.navItem} 
//           onPress={() => navigation.navigate("GroupChat")}
//         >
//           <Ionicons 
//             name="people" 
//             size={24} 
//             color={getIconColor("GroupChat")} 
//           />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.navItem} 
//           onPress={() => navigation.navigate("Timetable")}
//         >
//           <Ionicons 
//             name="calendar" 
//             size={24} 
//             color={getIconColor("Timetable")} 
//           />
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons 
//             name="notifications" 
//             size={24} 
//             color={getIconColor("Notifications")} 
//           />
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons 
//             name="bag" 
//             size={24} 
//             color={getIconColor("Bag")} 
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   };