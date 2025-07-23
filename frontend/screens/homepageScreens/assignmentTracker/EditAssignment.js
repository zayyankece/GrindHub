import React, { useState, useContext, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';

export default function EditAssignment({navigation}) {
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

  const [title, setTitle] = useState("Read Chapter 3");
  const [module, setModule] = useState("CS1101S");
  const [deadline, setDeadline] = useState("2025-07-01");
  const [estimatedTime, setEstimatedTime] = useState("3");

  const handleSave = () => {
    // Handle saving logic here
    console.log('Assignment updated');
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Assignment deleted');
  };

  return (
    <View style={styles.container}>
      <GrindHubHeader navigation={navigation}/>
      <Text style={styles.header}>Edit Assignment</Text>

      <Text style={styles.label}>Module</Text>
      <TextInput
        style={styles.input}
        value={module}
        onChangeText={setModule}
      />

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Deadline</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Time Estimate (hours)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={estimatedTime}
        onChangeText={setEstimatedTime}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash" size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete Assignment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
});