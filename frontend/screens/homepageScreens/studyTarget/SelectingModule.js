import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { useRoute } from '@react-navigation/native';
import { jwtDecode } from "jwt-decode";

export default function TargetPerformanceScreen({ navigation, route }) {
  // const route = useRoute();

  const {token, name} = route.params
  const decodedToken = jwtDecode(token)
  const userid = decodedToken.userid 

  const modules = ['ST2131','CS1231','DSA1101','DSA2102','DSA3101','DSA4288M','CS2040','CS3230'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8400" barStyle="light-content" />

      <GrindHubHeader navigation={navigation} token={token}/>

      <Text style={styles.title}>Target and Performance</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {modules.map((module, index) => (
          <TouchableOpacity
          key={index}
          style={styles.moduleButton}
          onPress={() => navigation.navigate('StudyTargetReport', { token:token, moduleCode: module })}
        >
          <Text style={styles.moduleText}>{module}</Text>
        </TouchableOpacity>
        
        ))}
      </ScrollView>

      <GrindHubFooter navigation={navigation} activeTab={"SelectingModule"} token={token}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#FED7AA' },
  title: { fontSize:20, fontWeight:'500', textAlign:'center', marginVertical:20 },
  scrollContainer: { paddingHorizontal:16, paddingBottom:100 },
  moduleButton: {
    backgroundColor:'#FFD93D',
    paddingVertical:16,
    borderRadius:16,
    marginTop:16,
    alignItems:'center',
    shadowColor:'#000',
    shadowOpacity:0.2,
    shadowRadius:4,
    elevation:4,
  },
  moduleText: {
    fontSize:18,
    fontWeight:'bold',
    color:'#1F2937',
  },
});