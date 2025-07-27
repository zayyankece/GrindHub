import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import GrindHubHeader from '../components/GrindHubHeader';
import GrindHubFooter from '../components/GrindHubFooter';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';

const tasks = [
  { code: 'CS1010S', title: 'Mission 1', progress: 0.9 },
  { code: 'HSA1000', title: 'Field Observation Exercise', progress: 0.7 },
  { code: 'IS1108', title: 'Assignment 2', progress: 0.1 },
  { code: 'IT1244', title: 'Group Project 1', progress: 0 },
  { code: 'MA2104', title: 'Homework 1', progress: 0.3 },
  { code: 'HSI1000', title: 'Workshop 2', progress: 0.5 },
  { code: 'SP1541', title: 'Writing Assignment 2', progress: 0.2 },
  { code: 'ES1103', title: 'Synthesis CA1', progress: 0.4 },
  { code: 'MA2002', title: 'Homework 1', progress: 0.8 },
];

export default function TrackerPage({ navigation }) {
  const { userToken, signOut } = useContext(AuthContext);
  const decodedToken = useMemo(() => {
    if (userToken) {
      try {
        return jwtDecode(userToken);
      } catch (e) {
        console.error("Failed to decode token in TrackerPage:", e);
        signOut();
        return null;
      }
    }
    return null;
  }, [userToken, signOut]);

  const userid = decodedToken?.userid;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <GrindHubHeader navigation={navigation} />
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search" style={styles.searchInput} />
          <Ionicons name="search" size={20} color="#333" style={styles.icon} />
          <Ionicons name="filter" size={20} color="#333" style={styles.icon} />
        </View>
        <ScrollView style={styles.scrollView}>
          {tasks.map((task, idx) => (
            <View key={idx} style={styles.taskCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{task.code} - {task.title}</Text>
                <View style={styles.progressRow}>
                  <ProgressBar progress={task.progress} color="#00cc44" style={styles.progressBar} />
                  <Text>{Math.round(task.progress * 100)} % Completed</Text>
                </View>
              </View>
              <Text>Due 25 May - 23.00</Text>
            </View>
          ))}
        </ScrollView>
        {/* Optional footer */}
        {/* <GrindHubFooter navigation={navigation} /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f5f1',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f5f1',
  },
  searchContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  icon: {
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  taskCard: {
    backgroundColor: '#ffde59',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    width: 100,
    marginRight: 8,
  },
});
