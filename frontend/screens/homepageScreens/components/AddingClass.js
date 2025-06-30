import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [venue, setVenue] = useState('');

  // --- New state for Date and Time Pickers ---
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // --- onChange handlers for pickers ---
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(Platform.OS === 'ios');
    setStartTime(currentTime);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(Platform.OS === 'ios');
    setEndTime(currentTime);
  };

  /**
   * Handles adding a new class by sending a POST request to the server.
   */
  const handleAddClass = async () => {
    // 1. Validate inputs
    if (!moduleCode || !classType || !venue) {
      Alert.alert("Incomplete Form", "Please fill out all the fields to add a class.");
      return;
    }

    // 2. Format data for the API
    const formattedDate = date.toISOString().split('T')[0];
    const startTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endTimeInMinutes = endTime.getHours() * 60 + endTime.getMinutes();

    if (startTimeInMinutes >= endTimeInMinutes) {
        Alert.alert("Invalid Time", "End time must be after start time.");
        return;
    }

    // 3. Construct payload for the API
    const classData = {
      userid,
      modulename: moduleCode,
      classtype: classType,
      classlocation: venue,
      startdate: formattedDate,
      starttime: startTimeInMinutes,
      enddate: formattedDate, // Class is assumed to be on the same day
      endtime: endTimeInMinutes,
    };

    try {
      // 4. Send fetch request
      const response = await fetch('https://grindhub-production.up.railway.app/api/auth/setClass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Uncomment if you use Bearer token auth
        },
        body: JSON.stringify(classData),
      });

      const result = await response.json();

      // 5. Handle response
      if (response.ok && result.success) {
        Alert.alert("Success", "Class has been added to your timetable.");
        navigation.goBack();
      } else {
        Alert.alert("Failed to Add Class", result.message || "An error occurred on the server.");
      }
    } catch (error) {
      // 6. Handle network errors
      console.error("Error adding class:", error);
      Alert.alert("Network Error", "Unable to connect to the server. Please check your internet connection.");
    }
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Module Code</Text>
            <TextInput style={styles.inputField} placeholder="e.g., CS1010S" value={moduleCode} onChangeText={setModuleCode}/>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Class Type</Text>
            <TextInput style={styles.inputField} placeholder="e.g., Lecture, Tutorial, Lab" value={classType} onChangeText={setClassType} />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Day</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.inputField, styles.pickerButton]}>
                <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={[styles.inputField, styles.pickerButton, { flex: 1 }]}>
                    <Text style={styles.inputText}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={[styles.inputField, styles.pickerButton, { flex: 1 }]}>
                    <Text style={styles.inputText}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
            </View>
          </View>

          {/* DateTimePicker Modals */}
          {showDatePicker && (
            <DateTimePicker testID="datePicker" value={date} mode="date" display="default" onChange={onDateChange} />
          )}
          {showStartTimePicker && (
            <DateTimePicker testID="startTimePicker" value={startTime} mode="time" display="default" onChange={onStartTimeChange} />
          )}
          {showEndTimePicker && (
            <DateTimePicker testID="endTimePicker" value={endTime} mode="time" display="default" onChange={onEndTimeChange} />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Venue / Location</Text>
            <TextInput style={styles.inputField} placeholder="e.g., i3-AUD" value={venue} onChangeText={setVenue} />
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.createButton} onPress={handleAddClass}>
          <Text style={styles.createButtonText}>Add Class</Text>
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
    fontSize: 16,
  },
  pickerButton: {
    justifyContent: 'center',
  },
  inputText: {
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
