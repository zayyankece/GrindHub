import React, {useState} from 'react';
// Make sure to import Alert
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";

export default function AddingAssignment({navigation, route}) {
  const { token } = route.params;
  const decodedToken = jwtDecode(token);
  const userid = decodedToken.userid;

  const [taskName, setTaskName] = useState('');
  const [taskGroup, setTaskGroup] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState(''); // Note: description is not sent to the backend in this example as the API doesn't handle it.

  /**
   * Handles creating the assignment by sending a POST request to the server.
   * Navigates back on success and shows an alert on failure.
   */
  const handleCreateAssignment = async () => {
    // Basic validation to ensure required fields are not empty
    if (!taskName || !taskGroup || !deadlineDate || !deadlineTime || !hours || !minutes) {
      Alert.alert("Incomplete Form", "Please fill out all the required fields.");
      return;
    }

    // Combine hours and minutes into a single string for 'timeneeded'
    const timeNeeded = (parseInt(hours, 10) || 0) * 60 + (parseInt(minutes, 10) || 0);

    try {
      // Replace 'http://your-api-url.com' with your actual API endpoint
      const response = await fetch('https://grindhub-production.up.railway.app/api/auth/setAssignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you use token-based authentication (like Bearer), add it here
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userid: userid,
          assignmentname: taskName,
          assignmentmodule: taskGroup,
          assignmentduedate: deadlineDate,
          assignmenttimeduedate: deadlineTime,
          timeneeded: timeNeeded,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(
          "Success!", 
          "Your assignment has been created successfully."
        );
        // Navigate back to the previous screen
        navigation.goBack(); 
      } else {
        // Handle server-side errors (e.g., validation failed)
        Alert.alert("Creation Failed", data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Fetch error:", error);
      Alert.alert("Network Error", "Could not connect to the server. Please check your connection and try again.");
    }
  };


  // ... rest of your component code (return statement, styles) remains the same
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

// ... Styles remain the same
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