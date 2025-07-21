import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  Button,
  Pressable,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubFooter from './components/GrindHubFooter';
import GrindHubHeader from './components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client'; // 👈 Import socket.io-client

const FreeTimeCard = () => (
  <View style={styles.scheduleItem}>
    <View style={styles.scheduleItemLeft}>
      <Text style={styles.scheduleItemText}>
        You don't have anything to do!
      </Text>
    </View>
  </View>
);

// Define your Socket.IO server URL here
// IMPORTANT: Use your actual local IP address if testing on a physical device,
// otherwise 'http://localhost:5000' for emulators/simulators.
// For Android emulator, 'http://10.0.2.2:5000' is typically used to access host machine's localhost.
const SOCKET_SERVER_URL = 'https://grindhubchatbot-production.up.railway.app'; // Example for Android emulator

export default function HomePage({navigation, route}) {

  const { token } = route.params
  const decodedToken = jwtDecode(token)
  const userid = decodedToken.userid

  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [groups, setGroups] = useState([]);
  const [username, setUsername] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const todayDate = new Date(today);
    todayDate.setDate(today.getDate());
    todayDate.setHours(0, 0, 0, 0);
    return todayDate;
  })

  // 👇 New state for chat messages
  const [messages, setMessages] = useState([]);
  // 👇 New state for chat input
  const [chatInput, setChatInput] = useState('');
  // 👇 Ref for auto-scrolling chat
  const chatScrollViewRef = useRef();

  // 👇 Socket.IO instance
  const socket = useMemo(() => io(SOCKET_SERVER_URL, {
    transports: ['websocket'], // Prefer WebSocket for React Native
    forceNew: true, // Forces a new connection every time
  }), []); // Empty dependency array means it's created once

  useEffect(() => {
    // Socket.IO event listeners
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server!');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server!');
    });

    socket.on('chat_message', (msg) => {
      console.log('Received message:', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat_message');
      socket.off('connect_error');
      socket.disconnect(); // Disconnect when component unmounts
    };
  }, [socket]); // Re-run effect if socket instance changes (which it won't with useMemo)

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatScrollViewRef.current) {
      chatScrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (chatInput.trim()) {
      const userMessage = { sender: 'User', message: chatInput.trim() };
      setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to UI immediately
      socket.emit('user_message', { message: chatInput.trim() }); // Send to server
      setChatInput(''); // Clear input
    }
  };

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
      userid : userid,
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
          getAssignments({ userid: userid }),
          getClass({ userid: userid })
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
    const fetchGroups = async () => {
      try {
        const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getGroups", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          userid: userid,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setGroups(data.groups);
        } else {
          if (data.message == "No groups found!"){
            console.log("No groups found, santai aja dulu bang!")
          }
          else {
          console.error("Failed to fetch groups:", data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const getUsername = async() => {
      try{
        const response = await fetch(`https://grindhub-production.up.railway.app/api/auth/getUser`, {
          method : "POST",
          headers : { 'Content-Type': 'application/json' },
          body : JSON.stringify({
            userid: userid,
          }),
        });
        const data = await response.json();

        if (data.success){
          setUsername(data.existingUser[0].username)
        }
      } catch (error) {
        console.error("there are error", error)
      }
    }

    fetchGroups();
    fetchAndCombineData();
    getUsername();

  }, []);

  function combineAndExtract(classesArray, assignmentsArray) {
    // Process the classes array using map to transform each item
    const extractedClasses = classesArray.map(classItem => ({
      module_code: classItem.modulename,
      name: classItem.classtype,
      type: classItem.classtype,
      location: classItem.classlocation,
      date: classItem.startdate, // Using startdate as the primary time
      time: classItem.starttime,
      percentage: null
    }));

    // Process the assignments array
    const extractedAssignments = assignmentsArray.map(assignmentItem => ({
      module_code: assignmentItem.assignmentmodule,
      name: assignmentItem.assignmentname,
      type: "Assignment", // Explicitly defining the type
      location: null,     // Assignments don't have a physical location
      date: assignmentItem.assignmentduedate,
      time: assignmentItem.assignmenttimeduedate,
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
        const dateKey = getDateKey(event.date);
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
            <Text style={styles.scheduleTime}>{formatTimeToHHMM(event.date)}</Text>
          </View>
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
            <Text style={styles.scheduleTime}>{formatTimeToHHMM(event.date)}</Text>
          </View>
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
            <Text style={styles.scheduleTime}>{formatTimeToHHMM(event.date)}</Text>
          </View>
        );
      default:
        return null
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
    setStartDate(startDate => {
      const newDay = new Date(startDate);
      newDay.setDate(startDate.getDate() - 1);
      return newDay;
    });

  };

  const rightArrowPressed = () => {
    setStartDate(startDate => {
      const newDay = new Date(startDate);
      newDay.setDate(startDate.getDate() + 1);
      return newDay;
    });

  };

  const [activeTimer, setActiveTimer] = useState(null);

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

        <GrindHubFooter navigation={navigation} activeTab="HomePage" token={token}/>

      </SafeAreaView>
    )
  }
  else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FF8400" barStyle="light-content" />

        <GrindHubHeader navigation={navigation} token={token}/>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Hello, {username}!</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate("GroupChat", {token:token})}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your Groups</Text>
              <View style={styles.groupsList}>
                {groups.map((group, index) => (
                  <View key={index} style={styles.groupItem}>
                    <View style={styles.groupHeader}>
                      <Text style={styles.groupName}>{group.groupname}</Text>
                      {/* <Text style={styles.groupTime}>{group.time}</Text> */}
                    </View>
                    <View style={styles.groupMessage}>
                      <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                      <Text style={styles.groupMessageText}>this is a subtitle (not yet implemented)</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>

          {/* Your Assignments */}
          <TouchableOpacity
            onPress={() => navigation.navigate('TrackerPage', {token:token})}
            activeOpacity={0.7}
          >
            <View style={[styles.card, styles.lastCard]}>
              <Text style={styles.cardTitle}>Your Assignments</Text>
              <View style={styles.assignmentsList}>
                {assignments.length > 0 ? (
                  assignments.map((assignment, index) => (
                    <View key={index} style={styles.assignmentItem}>
                      <View style={styles.assignmentHeader}>
                        <Text style={styles.assignmentTitle}>
                          {assignment.assignmentmodule} - {assignment.assignmentname}
                        </Text>
                        <Text style={styles.assignmentDue}>
                          Due {formatTimeToHHMM(assignment.assignmentduedate, "Asia/Singapore")}
                        </Text>
                      </View>
                      <ProgressBar progress={assignment.assignmentpercentage} />
                    </View>
                  ))
                ) : (
                  <View style={styles.noAssignmentsView}>
                    <Text style={styles.noAssignmentsText}>
                      No assignments at the moment!
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>

        </ScrollView>

        {/* Modal for "Add" functionality */}
        <Modal
            transparent={true}
            animationType="fade"
            visible={addModalVisible}
            onRequestClose={() => setAddModalVisible(false)}>

            {/* This Pressable now covers the full screen thanks to the style fix */}
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setAddModalVisible(false)}>

              {/* This inner Pressable stops touches on the modal from closing it */}
                <View style={styles.modalView}>
                  <View style={styles.innerContainer}>

                    {/* Simplified TouchableOpacity items */}
                    <TouchableOpacity style={styles.itemBox} onPress={() => {setAddModalVisible(false);navigation.navigate("AddingModule", {token:token})}}>
                      <Text style={styles.itemText}>Add Module</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.itemBox} onPress={() => {setAddModalVisible(false);navigation.navigate("AddingClass", {token:token})}}>
                      <Text style={styles.itemText}>Add Class</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.itemBox} onPress={() => {setAddModalVisible(false);navigation.navigate("AddingAssignment", {token:token})}}>
                      <Text style={styles.itemText}>Add Task</Text>
                    </TouchableOpacity>

                  </View>
                </View>
            </Pressable>
        </Modal>

        {/* New Modal for Chatbot */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={chatModalVisible}
          onRequestClose={() => setChatModalVisible(false)}>
          <Pressable
            style={styles.chatModalOverlay}
            onPress={() => setChatModalVisible(false)}>
            <Pressable style={styles.chatModalContainer} onPress={(e) => e.stopPropagation()}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>GrindHub Bot</Text>
                <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#1F2937" />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.chatContent}
                ref={chatScrollViewRef} // Attach ref for auto-scrolling
                onContentSizeChange={() => chatScrollViewRef.current.scrollToEnd({ animated: true })}
              >
                {/* Dynamically rendered chat messages */}
                {messages.map((msg, index) => (
                  <View
                    key={index}
                    style={msg.sender === 'Bot' ? styles.chatMessageBot : styles.chatMessageUser}
                  >
                    <Text style={styles.chatMessageText}>{msg.message}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.chatInputContainer}>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder="Type your message..."
                  placeholderTextColor="#6B7280"
                  value={chatInput}
                  onChangeText={setChatInput}
                  onSubmitEditing={sendMessage} // Send message on pressing enter/return
                  returnKeyType="send"
                />
                <TouchableOpacity style={styles.chatSendButton} onPress={sendMessage}>
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>


      {/* Your FAB code, which now sits "under" the modal */}
      <View style={styles.fab}>
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabButton} onPress={() => setChatModalVisible(true)}>
            <Ionicons name="chatbubble" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabButtonDark}
            onPress={() => {setAddModalVisible(true)}}
          >
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

        {/* Bottom Navigation */}
        <GrindHubFooter navigation={navigation} activeTab="HomePage" token={token}/>

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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    top:0,
    left:0,
    bottom: 0,
    right: 0,
  },
  modalView: {
    bottom:30,
    width: '200',
    marginBottom:120,
    marginRight:15,
    backgroundColor: '#f5f1e9',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    // Shadow for the modal
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  innerContainer: {
    width: '100%',
    backgroundColor: '#eae6db',
    borderRadius: 20,
    paddingVertical: 2, // Add vertical space inside
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  itemBox: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA333',
    borderRadius: 20,
    marginVertical: 6, // Creates space between the two boxes
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noAssignmentsView: {
    backgroundColor: '#FFD93D',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAssignmentsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  // New styles for Chat Modal
  chatModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%', // Adjust height as needed
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chatContent: {
    flex: 1,
    paddingVertical: 10,
  },
  chatMessageBot: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  chatMessageUser: {
    backgroundColor: '#DCF8C6', // A light green for user messages
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  chatMessageText: {
    fontSize: 14,
    color: '#1F2937',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  chatSendButton: {
    backgroundColor: '#F97316',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});