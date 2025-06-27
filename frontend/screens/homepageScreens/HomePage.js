import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from './components/GrindHubFooter';
import GrindHubHeader from './components/GrindHubHeader';

export default function GrindHub({navigation}) {

  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])

  const getAssignments = async ({userid}) => {
    console.log(userid)
    try {
      const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getAssignments", {
      method : "POST",
      headers : { 'Content-Type': 'application/json' },
      body : JSON.stringify({
      userid : "TEST_USER",
      }),
    });
    
    const data = await response.json()

    if (data.success == false){
      return []
    }
    // assignments = data.assignments
    // console.log(assignments)
    return data.assignments
    }
    catch (error){
      console.error(error)
    }
  }

  const getClass = async ({userid}) =>{
    try {
      const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getClass", {
      method : "POST",
      headers : { 'Content-Type': 'application/json' },
      body : JSON.stringify({
      userid : userid,
      }),
    });
    
    const data = await response.json()

    if (data.success == false){
      return []
    }
    console.log(data.classes)
    return data.classes

    }
    catch (error){
      console.error(error)
    }
  }

  // classes = getClass({userid: "TEST_USER"})

  useEffect(() => {
    const fetchAndSetAssignments = async () => {
      // Set loading to true in case you want a pull-to-refresh feature later
      const fetchedAssignments = await getAssignments({ userid: "TEST_USER" });
      setAssignments(fetchedAssignments);
    };

    const fecthAndSetClasses = async () => {
      const fetchedClasses = await getClass({userid: "TEST_USER"});
      setClasses(fetchedClasses)
    }

    fetchAndSetAssignments();
    fecthAndSetClasses();
  }, []);

  const [activeTimer, setActiveTimer] = useState(null);

  const scheduleItems = [
    { code: 'MA2104', type: 'Lecture', room: 'LT27', time: '9.00 - 11.00' },
    { code: 'IT1244', type: 'Tutorial', room: 'S16 0204', time: '13.00 - 14.00' },
    { code: 'CS2030', type: 'Lab Assignment', time: '23.59' }
  ];

  const groups = [
    { 
      name: 'Only for people with 5.00 GPA', 
      message: 'Guys, let\'s finish entire material tonight',
      time: '13.54'
    },
    { 
      name: 'Bombardillo Crocodilo Project', 
      message: 'Cappucino assasino is bugged, need help',
      time: '12.03'
    }
  ];

  // const assignments = [
  //   { 
  //     code: 'HSI2010', 
  //     name: 'Workshop 1 Assignment', 
  //     progress: 60, 
  //     due: '5 June - 21:00' 
  //   },
  //   { 
  //     code: 'CS1010s', 
  //     name: 'Mission 1', 
  //     progress: 20, 
  //     due: '9 June' 
  //   }
  // ];

  const startTimer = (type) => {
    setActiveTimer(type);
  };

  const ProgressBar = ({ progress }) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${progress}%`,
              backgroundColor: progress >= 50 ? '#10B981' : '#22C55E'
            }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{progress}% Completed</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8400" barStyle="light-content" />
      
      <GrindHubHeader navigation={navigation}/>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello, Sanny!</Text>
          <Ionicons name="search-outline" size={24} color="#374151" />
        </View>

        {/* Schedule Card */}
        <View style={styles.card}>
          <Text style={styles.dateText}> Mon, 26 May 2025 </Text>
          <View style={styles.scheduleList}>
            {scheduleItems.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleItemLeft}>
                  <Text style={styles.scheduleItemText}>
                    {item.code} {item.type}
                    {item.room && ` - ${item.room}`}
                  </Text>
                </View>
                <Text style={styles.scheduleTime}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Study Timer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Study Timer</Text>
          <View style={styles.timerButtons}>
            <TouchableOpacity 
              style={[
                styles.timerButton,
                activeTimer === 'CS2030' && styles.timerButtonActive
              ]}
              onPress={() => startTimer('CS2030')}
            >
              <Text style={[
                styles.timerButtonText,
                activeTimer === 'CS2030' && styles.timerButtonTextActive
              ]}>
                Start CS2030 Timer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.timerButton,
                activeTimer === 'Other' && styles.timerButtonActive
              ]}
              onPress={() => startTimer('Other')}
            >
              <Text style={[
                styles.timerButtonText,
                activeTimer === 'Other' && styles.timerButtonTextActive
              ]}>
                Start Other Timer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Groups */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Groups</Text>
          <View style={styles.groupsList}>
            {groups.map((group, index) => (
              <View key={index} style={styles.groupItem}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupTime}>{group.time}</Text>
                </View>
                <View style={styles.groupMessage}>
                  <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                  <Text style={styles.groupMessageText}>{group.message}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Your Assignments */}
        <View style={[styles.card, styles.lastCard]}>
          <Text style={styles.cardTitle}>Your Assignments</Text>
          <View style={styles.assignmentsList}>
            {assignments.map((assignment, index) => (
              <View key={index} style={styles.assignmentItem}>
                <View style={styles.assignmentHeader}>
                  <Text style={styles.assignmentTitle}>
                    {assignment.assignmentmodule} - {assignment.assignmentname}
                  </Text>
                  <Text style={styles.assignmentDue}>Due {assignment.assignmentduedate}</Text>
                </View>
                <ProgressBar progress={assignment.assignmentpercentage} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fab}>
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabButton}>
            <Ionicons name="chatbubble" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabButtonDark}>
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <GrindHubFooter navigation={navigation} activeTab="HomePage"/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED7AA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFA333',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  lastCard: {
    marginBottom: 100,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  scheduleList: {
    gap: 12,
  },
  scheduleItem: {
    backgroundColor: '#FFD93D',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleItemLeft: {
    flex: 1,
  },
  scheduleItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  scheduleTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    flex: 1,
    backgroundColor: '#FFD93D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  timerButtonActive: {
    backgroundColor: '#F97316',
  },
  timerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  timerButtonTextActive: {
    color: 'white',
  },
  groupsList: {
    gap: 12,
  },
  groupItem: {
    backgroundColor: '#FFD93D',
    borderRadius: 12,
    padding: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  groupTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  groupMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupMessageText: {
    fontSize: 12,
    color: '#374151',
    fontStyle: 'italic',
    flex: 1,
  },
  assignmentsList: {
    gap: 12,
  },
  assignmentItem: {
    backgroundColor: '#FFD93D',
    borderRadius: 12,
    padding: 12,
  },
  assignmentHeader: {
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  assignmentDue: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
  },
  fabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 8,
  },
  fabButton: {
    width: 32,
    height: 32,
    backgroundColor: '#EA580C',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButtonDark: {
    width: 32,
    height: 32,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
});