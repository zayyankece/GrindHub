import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";

export default function AddingAssignment({navigation, route}) {
  const { token } = route.params
  const decodedToken = jwtDecode(token)
  const userid = decodedToken.userid 

  const [taskName, setTaskName] = useState('');
  const [taskGroup, setTaskGroup] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateAssignment = () => {
    // Logic to create the assignment goes here
    console.log({
      taskName,
      taskGroup,
      deadlineDate,
      deadlineTime,
      hours,
      minutes,
      description,
    });
    // Example: navigation.goBack();
  };

  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GrindHubHeader navigation={navigation} token={token} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Assignment</Text>
          <View style={{ width: 24 }}/>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Task Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., Mission 1 - Time Travel"
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>

          {/* Task Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Group</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., CS1010S"
              value={taskGroup}
              onChangeText={setTaskGroup}
            />
          </View>

          {/* Deadline */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deadline</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={[styles.inputField, { flex: 1, marginRight: 8 }]}
                placeholder="23 December 2025"
                value={deadlineDate}
                onChangeText={setDeadlineDate}
              />
              <TextInput
                style={[styles.inputField, { flex: 0.5 }]}
                placeholder="23:59"
                value={deadlineTime}
                onChangeText={setDeadlineTime}
              />
            </View>
          </View>

          {/* Time Needed */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time Needed</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                placeholder="1"
                value={hours}
                onChangeText={setHours}
              />
              <Text style={styles.timeLabel}>Hour(s)</Text>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                placeholder="30"
                value={minutes}
                onChangeText={setMinutes}
              />
              <Text style={styles.timeLabel}>Minutes</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.inputField, { minHeight: 100, textAlignVertical: 'top' }]}
              placeholder="Need to learn cobra language first"
              value={description}
              onChangeText={setDescription}
              multiline={true}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateAssignment}>
          <Text style={styles.createButtonText}>Create Assignment</Text>
        </TouchableOpacity>
      </ScrollView>
      <GrindHubFooter navigation={navigation} activeTab={"Timetable"} token={token} />
    </SafeAreaView>
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