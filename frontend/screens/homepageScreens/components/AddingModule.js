import React, { useState, useMemo, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';

export default function AddingModule({ navigation }) {
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

  // State for module-related fields
  const [moduleCode, setModuleCode] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [credits, setCredits] = useState('');
  const [instructor, setInstructor] = useState('');

  /**
   * Handles adding a new module by sending a POST request to the server.
   */
  const handleAddModule = async () => {
    // 1. Validate inputs
    if (!moduleCode || !moduleTitle || !credits || !instructor) {
      Alert.alert("Incomplete Form", "Please fill out all the fields to add a module.");
      return;
    }

    // 2. Construct payload for the API
    const moduleData = {
      modulename: moduleCode,
      moduletitle: moduleTitle,
      credits: parseInt(credits, 10), // Ensure credits are sent as a number
      instructor: instructor,
    };

    try {
      // 3. Send fetch request
      // IMPORTANT: Replace 'http://your-api-url.com' with your actual API endpoint
      const response = await fetch('https://grindhub-production.up.railway.app/api/auth/setModule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Uncomment if you use Bearer token auth
        },
        body: JSON.stringify(moduleData),
      });

      const result = await response.json();

      // 4. Handle response
      if (response.ok && result.success) {
        Alert.alert("Success", "Module has been added successfully.");
        navigation.goBack();
      } else {
        Alert.alert("Failed to Add Module", result.message || "An error occurred on the server.");
      }
    } catch (error) {
      // 5. Handle network errors
      console.error("Error adding module:", error);
      Alert.alert("Network Error", "Unable to connect to the server. Please check your internet connection.");
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
