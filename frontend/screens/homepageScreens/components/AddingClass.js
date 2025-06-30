import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";

export default function AddingClass({ navigation, route }) {
  const { token } = route.params;
  const decodedToken = jwtDecode(token);
  const userid = decodedToken.userid;

  // State for class-related fields
  const [moduleCode, setModuleCode] = useState('');
  const [classType, setClassType] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');

  const handleAddClass = () => {
    // Logic to add the new class to the timetable
    console.log({
      userid,
      moduleCode,
      classType,
      day,
      startTime,
      endTime,
      venue,
    });
    // You might want to navigate back or to the timetable screen
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF7ED' }}>
      <GrindHubHeader navigation={navigation} token={token} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Class</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Module Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Module Code</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., CS1010S"
              value={moduleCode}
              onChangeText={setModuleCode}
            />
          </View>

          {/* Class Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Class Type</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., Lecture, Tutorial, Lab"
              value={classType}
              onChangeText={setClassType}
            />
          </View>
          
          {/* Day of the Week */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Day</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., Monday"
              value={day}
              onChangeText={setDay}
            />
          </View>

          {/* Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <TextInput
                style={[styles.inputField, { flex: 1 }]}
                placeholder="Start Time (e.g., 14:00)"
                value={startTime}
                onChangeText={setStartTime}
              />
              <TextInput
                style={[styles.inputField, { flex: 1 }]}
                placeholder="End Time (e.g., 16:00)"
                value={endTime}
                onChangeText={setEndTime}
              />
            </View>
          </View>

          {/* Venue */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Venue / Location</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., i3-AUD"
              value={venue}
              onChangeText={setVenue}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleAddClass}>
          <Text style={styles.createButtonText}>Add Class</Text>
        </TouchableOpacity>
      </ScrollView>
      <GrindHubFooter navigation={navigation} activeTab={"Timetable"} token={token} />
    </SafeAreaView>
  );
}

// Re-using the same styles from your example
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF7ED',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  createButton: {
    backgroundColor: '#F97316',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
