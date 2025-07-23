import React, { useState, useContext, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';

export default function AddingAssignment({ navigation }) {
  const { userToken, signOut } = useContext(AuthContext);
  // Decode token to get userid
  const decodedToken = useMemo(() => {
    if (userToken) {
      try {
        return jwtDecode(userToken);
      } catch (e) {
        console.error("Failed to decode token in ChatScreen:", e);
        // If token is invalid, sign out the user
        signOut();
        return null;
      }
    }
    return null;
  }, [userToken, signOut]);

  // Derive userid and username from the decoded token
  const userid = decodedToken?.userid;

  // Form state
  const [taskName, setTaskName] = useState('');
  const [taskGroup, setTaskGroup] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');

  // --- New state for Date and Time Pickers ---
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // --- onChange handlers for pickers ---
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, the picker is a modal
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  /**
   * Handles creating the assignment by sending a POST request to the server.
   */
  const handleCreateAssignment = async () => {
    // 1. Validate inputs
    if (!taskName || !taskGroup || !hours || !minutes) {
      Alert.alert("Incomplete Form", "Please fill out all the required fields.");
      return;
    }

    // 2. Format data for the API
    // Format date to "YYYY-MM-DD"
    // const formattedDate = date.toISOString().split('T')[0];

    // Convert selected time to total minutes from midnight (e.g., 1:00 AM = 60)
    const totalTimeInMinutes = time.getHours() * 60 + time.getMinutes();

    const { utcFormattedDate, utcLocalDueDateTime } = convertLocalToUtc(date, totalTimeInMinutes);
    
    // Convert 'time needed' to total minutes
    const timeNeeded = (parseInt(hours, 10) || 0) * 60 + (parseInt(minutes, 10) || 0);

    // 3. Construct payload
    const assignmentData = {
      userid: userid,
      assignmentname: taskName,
      assignmentmodule: taskGroup,
      assignmentduedate: utcFormattedDate, // Stored as a formatted string
      assignmenttimeduedate: utcLocalDueDateTime, // Stored as an integer
      timeneeded: timeNeeded,
    };

    try {
      // 4. Send fetch request
      // IMPORTANT: Replace with your actual API endpoint
      const response = await fetch('https://grindhub-production.up.railway.app/api/auth/setAssignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Uncomment if needed
        },
        body: JSON.stringify(assignmentData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Success!", "Your assignment has been created successfully.");
        navigation.goBack(); 
      } else {
        Alert.alert("Creation Failed", data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF7ED' }}>
      <GrindHubHeader navigation={navigation}/>
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Name</Text>
            <TextInput style={styles.inputField} placeholder="e.g., Mission 1 - Time Travel" value={taskName} onChangeText={setTaskName} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Group</Text>
            <TextInput style={styles.inputField} placeholder="e.g., CS1010S" value={taskGroup} onChangeText={setTaskGroup} />
          </View>

          {/* --- Updated Deadline Section --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deadline</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              {/* Date Picker Button */}
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.inputField, styles.pickerButton, { flex: 1 }]}>
                <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {/* Time Picker Button */}
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[styles.inputField, styles.pickerButton, { flex: 0.6 }]}>
                <Text style={styles.inputText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- DateTimePicker Modals --- */}
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time Needed</Text>
            <View style={styles.timeInputContainer}>
              <TextInput style={styles.timeInput} keyboardType="numeric" placeholder="1" value={hours} onChangeText={setHours} />
              <Text style={styles.timeLabel}>Hour(s)</Text>
              <TextInput style={styles.timeInput} keyboardType="numeric" placeholder="30" value={minutes} onChangeText={setMinutes} />
              <Text style={styles.timeLabel}>Minutes</Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.inputField, { minHeight: 100, textAlignVertical: 'top' }]} placeholder="Need to learn cobra language first" value={description} onChangeText={setDescription} multiline={true} />
          </View>
        </View>

        <View style={styles.divider} />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateAssignment}>
          <Text style={styles.createButtonText}>Create Assignment</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  pickerButton: {
    justifyContent: 'center',
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
    textAlign: 'center',
    minWidth: 60,
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

// helper function
function convertLocalToUtc(localDateOnly, dueDateTime) {

  const localDueDateTime = new Date(
      localDateOnly.getFullYear(),
      localDateOnly.getMonth(),
      localDateOnly.getDate(),
      Math.floor(dueDateTime / 60), // Hours
      dueDateTime % 60            // Minutes
  );


  const utcFormattedDate = localDueDateTime.toISOString().split('T')[0];
  const utcLocalDueDateTime = localDueDateTime.getUTCHours() * 60 + localDueDateTime.getUTCMinutes();

  return {
      utcFormattedDate: utcFormattedDate,
      utcLocalDueDateTime: utcLocalDueDateTime,
  };
}
