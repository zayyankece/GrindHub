import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";

export default function AddingModule({ navigation, route }) {
  const { token } = route.params;
  const decodedToken = jwtDecode(token);
  const userid = decodedToken.userid;

  // State for module-related fields
  const [moduleCode, setModuleCode] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [credits, setCredits] = useState('');
  const [instructor, setInstructor] = useState('');

  const handleAddModule = () => {
    // Logic to add the new module
    console.log({
      userid,
      moduleCode,
      moduleTitle,
      credits,
      instructor,
    });
    // You might want to navigate back after adding
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
          <Text style={styles.headerTitle}>New Module</Text>
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
              autoCapitalize="characters"
            />
          </View>

          {/* Module Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Module Title</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., Programming Methodology"
              value={moduleTitle}
              onChangeText={setModuleTitle}
            />
          </View>

          {/* Credits / Units */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Credits / Units</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., 4"
              value={credits}
              onChangeText={setCredits}
              keyboardType="numeric"
            />
          </View>

          {/* Instructor */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructor / Professor</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g., Prof. Ben Leong"
              value={instructor}
              onChangeText={setInstructor}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleAddModule}>
          <Text style={styles.createButtonText}>Add Module</Text>
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
