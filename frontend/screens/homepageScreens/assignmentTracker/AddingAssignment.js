import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";

export default function NewAssignmentScreen({navigation, route}) {
  const { token } = route.params
  const decodedToken = jwtDecode(token)
  const userid = decodedToken.userid 
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <GrindHubHeader navigation={navigation} token={token}/>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>New Assignment</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Task Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task Name</Text>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>Mission 1 - Time Travel</Text>
          </View>
        </View>

        {/* Task Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task Group</Text>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>CS1010S</Text>
          </View>
        </View>

        {/* Deadline */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deadline</Text>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>23 December 2025</Text>
            <Text style={styles.inputText}>23:59</Text>
          </View>
        </View>

        {/* Time Needed */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time Needed</Text>
          <View style={styles.timeInputContainer}>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>1</Text>
            </View>
            <Text style={styles.timeLabel}>Hour(s)</Text>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>30</Text>
            </View>
            <Text style={styles.timeLabel}>Minutes</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputField, { minHeight: 100 }]}>
            <Text style={styles.inputText}>Need to learn cobra language first</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Create Button */}
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create Assignment</Text>
      </TouchableOpacity>
      <GrindHubFooter navigation={navigation} activeTab={"Timetable"} token={token}/>
    </ScrollView>
  );
}

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
  },
  inputText: {
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minWidth: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
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