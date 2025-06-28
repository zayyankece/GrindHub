import React, { useState, useEffect, useMemo } from 'react';
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

const AssignmentCard = ({ title, percentage, dueDate, type = 'assignment' }) => (
  <View style={[styles.card, type === 'assignment' ? styles.assignmentCard : styles.projectCard]}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardContent}>
      <Text style={styles.dueDate}>{dueDate}</Text>
    </View>
  </View>
);

const LectureCard = ({ title, room, time }) => (
  <View style={styles.lectureCard}>
    <View style={styles.lectureContent}>
      <Text style={styles.lectureTitle}>{title}</Text>
      <Text style={styles.lectureRoom}>{room}</Text>
    </View>
    <Text style={styles.lectureTime}>{time}</Text>
  </View>
);

const FreeTimeCard = () => (
  <View style={styles.scheduleItem}>
    <View style={styles.scheduleItemLeft}>
      <Text style={styles.scheduleItemText}>
        You don't have anything to do!
      </Text>
    </View>
  </View>
);

export default function GrindHub({navigation}) {

  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const todayDate = new Date(today);
    todayDate.setDate(today.getDate());
    todayDate.setHours(0, 0, 0, 0);
    return todayDate;
  })

  const getDateKey = (isoString) => isoString.substring(0, 10);

  // Formats a Date object into "Tue, 27th May 2025"
  const formatSectionDate = (date) => {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const day = date.getDate();
      let suffix = 'th';
      if (day === 1 || day === 21 || day === 31) suffix = 'st';
      else if (day === 2 || day === 22) suffix = 'nd';
      else if (day === 3 || day === 23) suffix = 'rd';

      const formatted = date.toLocaleDateString('en-GB', options).replace(/(\d+)/, `$1${suffix}`);
      return formatted;
  }

  // Formats a time string into "13:00"
  const formatTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function formatTimeToHHMM(dateInput, timeZone) {
    // Ensure we are working with a Date object
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
    // Formatting options to get HH:mm in 24-hour format
    const options = {
      timeZone: timeZone,
      hour: '2-digit',   // Ensures the hour is always two digits (e.g., 07)
      minute: '2-digit', // Ensures the minute is always two digits (e.g., 00)
      hour12: false      // CRITICAL: Use 24-hour clock (19:00 instead of 7:00 PM)
    };
  
    return date.toLocaleTimeString('en-GB', options);
  }

  const getAssignments = async ({userid}) => {
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
    return data.classes

    }
    catch (error){
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchAndCombineData = async () => {
      try {
        const [fetchedAssignments, fetchedClasses] = await Promise.all([
          getAssignments({ userid: "TEST_USER" }),
          getClass({ userid: "TEST_USER" })
        ]);

        setAssignments(fetchedAssignments);
        setClasses(fetchedClasses);

        const combinedData = combineAndExtract(fetchedClasses, fetchedAssignments);
        setCombinedData(combinedData);

      } catch (error) {
        console.error("Failed to fetch or combine data:", error);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchAndCombineData();

  }, []); 

  function combineAndExtract(classesArray, assignmentsArray) {
    // Process the classes array using map to transform each item
    const extractedClasses = classesArray.map(classItem => ({
      module_code: classItem.module,
      name: classItem.classname,
      type: classItem.classname,
      location: classItem.classlocation,
      time: classItem.startdate, // Using startdate as the primary time
      percentage: null
    }));
  
    // Process the assignments array
    const extractedAssignments = assignmentsArray.map(assignmentItem => ({
      module_code: assignmentItem.assignmentmodule,
      name: assignmentItem.assignmentname,
      type: "Assignment", // Explicitly defining the type
      location: null,     // Assignments don't have a physical location
      time: assignmentItem.assignmentduedate,
      percentage: assignmentItem.assignmentpercentage
    }));
  
    // Combine both transformed arrays into one
    const combinedList = [...extractedClasses, ...extractedAssignments];

    combinedList.sort((a, b) => {
      return new Date(a.time) - new Date(b.time); // Just swap a and b
    });
  
    return combinedList;
  }

  const groupedEvents = useMemo(() => {
    const sorted = [...combinedData].sort((a, b) => new Date(a.time) - new Date(b.time));
    return sorted.reduce((acc, event) => {
        const dateKey = getDateKey(event.time);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {});
  }, [combinedData]); 

  const renderEventCard = (event, index) => {

    switch (event.type) {
      case 'Lecture':
        return (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.scheduleItemLeft}>
              <Text style={styles.scheduleItemText}>
                {event.module_code} - {event.name}
                {event.location && ` - ${event.location}`}
              </Text>
            </View>
            <Text style={styles.scheduleTime}>{formatTimeToHHMM(event.time)}</Text>
          </View>
          
          // <View 
          //   key={index}
          //   title={`${event.module_code} - ${event.type}`}
          //   room={event.location}
          //   time={formatTime(event.time)}
          // />
        );
      case 'Tutorial': // Cases are now combined
        return (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.scheduleItemLeft}>
              <Text style={styles.scheduleItemText}>
                {event.module_code} - {event.name}
                {event.location && ` - ${event.location}`}
              </Text>
            </View>
            <Text style={styles.scheduleTime}>{formatTimeToHHMM(event.time)}</Text>
          </View>
          
          // <View 
          //   key={index}
          //   title={`${event.module_code} - ${event.type}`}
          //   room={event.location}
          //   time={formatTime(event.time)}
          // />
        );
      case 'Assignment':
        return (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.scheduleItemLeft}>
              <Text style={styles.scheduleItemText}>
                {event.module_code} - {event.name}
                {event.location && ` - ${event.location}`}
              </Text>
            </View>
            <Text style={styles.scheduleTime}>{formatTimeToHHMM(event.time)}</Text>
          </View>
        );
        // return (
        //   <AssignmentCard
        //     key={index}
        //     title={`${event.module_code} - ${event.name}`}
        //     percentage={event.percentage}
        //     dueDate={`Due at ${formatTime(event.time)}`}
        //   />
        // );
      default:
        return (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.scheduleItemLeft}>
              <Text style={styles.scheduleItemText}>
                You don't have anything to do!
              </Text>
            </View>
          </View>
        );
    }
  };
  
  // The modified, cleaner renderDays function
  const renderDays = ({ todayDate }) => {
    const days = [];
    const numberOfDaysToShow = 1; // Kept for future flexibility
  
    for (let i = 0; i < numberOfDaysToShow; i++) {
      const currentDate = new Date(todayDate);
      currentDate.setDate(todayDate.getDate() + i);
  
      const dateKey = getDateKey(currentDate.toISOString());
      const eventsForDay = groupedEvents[dateKey] || [];
  
      days.push(
        <View key={dateKey}>
          {eventsForDay.length > 0
            ? eventsForDay.map(renderEventCard) // Use the new helper function
            : <FreeTimeCard />}
        </View>
      );
    }
    return days;
  };

  const leftArrowPressed = () => {
    setStartDate(currentMonday => {
      const newMonday = new Date(currentMonday);
      newMonday.setDate(currentMonday.getDate() - 1);
      return newMonday;
    });

  };
  
  const rightArrowPressed = () => {
    setStartDate(currentMonday => {
      const newMonday = new Date(currentMonday);
      newMonday.setDate(currentMonday.getDate() + 1);
      return newMonday;
    });

  };

  const [activeTimer, setActiveTimer] = useState(null);

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

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedToday= startDate.toLocaleDateString('en-US', options);

  if (isLoading){
    return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FF8400" barStyle="light-content" />
        
        <GrindHubHeader navigation={navigation}/>
  
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}/>  

        <GrindHubFooter navigation={navigation} activeTab="HomePage"/>
        
      </SafeAreaView>
    )
  }
  else {
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
          {/* <TouchableOpacity onPress={() => navigation.navigate("Timetable")}> */}
            <View style={[styles.card]}>
              <View style={styles.container2}>
                {/* Interactive Left Arrow */}
                <TouchableOpacity onPress={() => leftArrowPressed()}>
                  <Image
                    source={require("../../assets/Arrow to left.png")}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
          
                {/* Date Range Text */}
                <Text style={styles.dateText}>{formattedToday}</Text>
          
                {/* Interactive Right Arrow */}
                <TouchableOpacity onPress={() => rightArrowPressed()}>
                  <Image
                    source={require("../../assets/Arrow to right.png")}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </View>
              {renderDays({todayDate : startDate})}
            </View>
          {/* </TouchableOpacity> */}
  
          {/* Study Timer */}
          <TouchableOpacity>
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
          </TouchableOpacity>
  
          {/* Your Groups */}
          <TouchableOpacity>
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
          </TouchableOpacity>
  
          {/* Your Assignments */}
          <TouchableOpacity>
            <View style={[styles.card, styles.lastCard]}>
            <Text style={styles.cardTitle}>Your Assignments</Text>
            <View style={styles.assignmentsList}>
              {assignments.map((assignment, index) => (
                <View key={index} style={styles.assignmentItem}>
                  <View style={styles.assignmentHeader}>
                    <Text style={styles.assignmentTitle}>
                      {assignment.assignmentmodule} - {assignment.assignmentname}
                    </Text>
                    <Text style={styles.assignmentDue}>Due {formatTimeToHHMM(assignment.assignmentduedate, "Asia/Singapore")}</Text>
                  </View>
                  <ProgressBar progress={assignment.assignmentpercentage} />
                </View>
              ))}
            </View>
          </View>
          </TouchableOpacity>
          
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED7AA',
  },
  container2: {
    marginBottom:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f2f5', // A light, neutral background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Creates the pill shape
    marginHorizontal: 26, // Adds space on the sides of the screen
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
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
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
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