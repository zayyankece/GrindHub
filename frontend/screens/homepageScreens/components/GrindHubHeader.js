import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GrindHubHeader = ({ navigation, onProfilePress, token }) => {
  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else if (navigation) {
      navigation.navigate("UserProfile", {token:token});
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
        <Image source={require("../../../assets/GrindHub Logo White.png")} style={{flex: 1, backgroundColor: "#FF8400"}} resizeMode="contain"/>
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