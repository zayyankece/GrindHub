import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import GrindHubHeader from './components/GrindHubHeader';
import GrindHubFooter from './components/GrindHubFooter';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../AuthContext';

// --- HELPER FUNCTIONS ---

// Gets the date part of an ISO string (e.g., "2025-05-29")
const getDateKey = (isoString) => isoString.substring(0, 10);

// Formats a Date object into "Tue, 27th May 2025"
const formatSectionDate = (dateString) => {
  // Create a Date object from the input string.
  const date = new Date(dateString);
  const day = date.getDate();


  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) {
      suffix = 'st';
  } else if (day === 2 || day === 22) {
      suffix = 'nd';
  } else if (day === 3 || day === 23) {
      suffix = 'rd';
  }

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  // Format the date parts individually to correctly place the suffix
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' });

  // Construct the string manually to insert the suffix after the day number
  return `${weekday}, ${day}${suffix} ${month} ${year}`;
};

// Formats a time string into "13:00"
const formatTime = (utcMinutes) => {
  const date = new Date();

  // Calculate UTC hours and remaining minutes
  const utcHours = Math.floor(utcMinutes / 60);
  const remainingUtcMinutes = utcMinutes % 60;

  // Set the UTC hours and minutes for the date object
  // This will automatically adjust the local time representation
  date.setUTCHours(utcHours, remainingUtcMinutes, 0, 0); // Set seconds and milliseconds to 0

  // Format the date to a local time string (e.g., "10:00", "22:30")
  // 'en-GB' is used for 24-hour format without AM/PM.
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const ProgressBar = ({ percentage }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${percentage}%` }]} />
  </View>
);

const AssignmentCard = ({ title, percentage, dueDate, type = 'assignment' }) => (
  <View style={[styles.card, type === 'assignment' ? styles.assignmentCard : styles.projectCard]}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardContent}>
      <View style={styles.progressSection}>
        <ProgressBar percentage={percentage} />
        <Text style={styles.progressText}>{percentage} % Completed</Text>
      </View>
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
  <View style={styles.freeTimeCard}>
    <Text style={styles.freeTimeText}>You don't have anything to do!</Text>
  </View>
);

const DateSection = ({ date, children }) => (
  <View style={styles.dateSection}>
    <Text style={styles.dateHeader}>{date}</Text>
    <View style={styles.dateLine} />
    {children}
  </View>
);

const Timetable = ({navigation}) => {

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

  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getUTCDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday (0)
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - daysToSubtract);
    mondayDate.setHours(8, 0, 0, 0); // Set to 7 AM to ensure consistent date key
    return mondayDate;
  });

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
      return [] // Return empty array on error
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
      return [] // Return empty array on error
    }
  }

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
      // Sort by date first, then by time
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      // If dates are the same, sort by time (assuming time is a number representing minutes)
      return a.time - b.time;
    });


    return combinedList;
  }

  // Use useFocusEffect instead of useEffect for data fetching
  useFocusEffect(
    useCallback(() => {
      const fetchAndCombineData = async () => {
        if (!userid) {
          setIsLoading(false);
          return; // Don't fetch if userid is not available
        }

        try {
          setIsLoading(true); // Set loading to true when fetching starts
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

      fetchAndCombineData();
      console.log("useFocusEffect ran!");

      // Optional cleanup function (runs when screen blurs or unmounts)
      return () => {
        // You can add cleanup logic here if needed,
        // e.g., to cancel ongoing network requests.
        console.log("Timetable screen blurred or unmounted.");
      };
    }, [userid]) // Add userid as a dependency for useCallback
  );

  const groupedEvents = useMemo(() => {
    // Ensure combinedData is not empty and sort it before reducing
    const sorted = [...combinedData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.time - b.time; // Sort by time if dates are identical
    });

    return sorted.reduce((acc, event) => {
        const dateKey = getDateKey(event.date);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {});
  }, [combinedData]);

  const renderDays = ({mondayDate}) => {

    const days = [];
    const numberOfDaysToShow = 7;

    for (let i = 0; i < numberOfDaysToShow; i++) {
      const currentDate = new Date(mondayDate);

      currentDate.setDate(mondayDate.getDate() + i);
      const dateKey = getDateKey(currentDate.toISOString());
      const eventsForDay = groupedEvents[dateKey] || [];

      days.push(
          <DateSection key={dateKey} date={formatSectionDate(currentDate)}>
              {eventsForDay.length > 0 ? (
                  eventsForDay.map((event, index) => {
                      // console.log(currentDate, event.module_code, event.type, "event")
                      // ... switch statement to render cards (no change here)
                      switch (event.type) {
                          case 'Lecture':
                            return (
                              <LectureCard
                                  key={index}
                                  title={`${event.module_code} - ${event.type}`}
                                  room={event.location}
                                  time={formatTime(event.time)}
                              />
                              );
                          case 'Tutorial':
                            return (
                                    <LectureCard
                                        key={index}
                                        title={`${event.module_code} - ${event.type}`}
                                        room={event.location}
                                        time={formatTime(event.time)}
                                    />
                                    );
                          case 'Assignment':
                            return (
                                    <AssignmentCard
                                        key={index}
                                        title={`${event.module_code} - ${event.name}`}
                                        percentage={event.percentage}
                                        dueDate={`Due at ${formatTime(event.time)}`}
                                    />
                                  );
                          default:
                            return (
                              <LectureCard
                                  key={index}
                                  title={`${event.module_code} - ${event.type}`}
                                  room={event.location}
                                  time={formatTime(event.time)}
                              />
                              );
                      }
                  })
              ) : (
                  <FreeTimeCard />
              )}
          </DateSection>
      );
  }
  return days;
  };

  const leftArrowPressed = () => {
    setWeekStartDate(currentMonday => {
      const newMonday = new Date(currentMonday);
      newMonday.setDate(currentMonday.getDate() - 7);
      return newMonday;
    });
  };

  const rightArrowPressed = () => {
    setWeekStartDate(currentMonday => {
      const newMonday = new Date(currentMonday);
      newMonday.setDate(currentMonday.getDate() + 7);
      return newMonday;
    });
  };

  const sundayDate = new Date(weekStartDate);
  sundayDate.setDate(weekStartDate.getDate() + 6);

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedMonday = weekStartDate.toLocaleDateString('en-US', options);
  const formattedSunday = sundayDate.toLocaleDateString('en-US', options);
  const displayRange = `${formattedMonday} - ${formattedSunday}`;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />

        {/* Header */}
        <GrindHubHeader navigation={navigation}/>

        <View style={styles.container2}>
        {/* Interactive Left Arrow */}
        <TouchableOpacity onPress={() => leftArrowPressed()}>
          <Image
            source={require("../../assets/Arrow to left.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        {/* Date Range Text */}
        <Text style={styles.dateText}>{displayRange}</Text>

        {/* Interactive Right Arrow */}
        <TouchableOpacity onPress={() => rightArrowPressed()}>
          <Image
            source={require("../../assets/Arrow to right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      </SafeAreaView>
    );
  }
  else{
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />

        {/* Header */}
        <GrindHubHeader navigation={navigation}/>

        <View style={styles.container2}>
        {/* Interactive Left Arrow */}
        <TouchableOpacity onPress={() => leftArrowPressed()}>
          <Image
            source={require("../../assets/Arrow to left.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        {/* Date Range Text */}
        <Text style={styles.dateText}>{displayRange}</Text>

        {/* Interactive Right Arrow */}
        <TouchableOpacity onPress={() => rightArrowPressed()}>
          <Image
            source={require("../../assets/Arrow to right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderDays({mondayDate: weekStartDate})}
        </ScrollView>

      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED7AA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FED7AA', // Match the main container background
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  container2: {
    marginTop:15,
    marginBottom:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f2f5', // A light, neutral background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Creates the pill shape
    marginHorizontal: 16, // Adds space on the sides of the screen
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
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A4A4A', // Tints the icon to a professional dark gray
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600', // Semi-bold for emphasis
    color: '#1C1C1E', // A dark, modern text color
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSection: {
    marginTop: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateLine: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 15,
  },
  card: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  assignmentCard: {
    backgroundColor: '#FFD93D',
  },
  projectCard: {
    backgroundColor: '#FFD93D',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSection: {
    flex: 1,
    marginRight: 15,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  lectureCard: {
    backgroundColor: '#FF8C42',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lectureContent: {
    flex: 1,
  },
  lectureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lectureRoom: {
    fontSize: 14,
    color: '#333',
  },
  lectureTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  freeTimeCard: {
    backgroundColor: '#90EE90',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  freeTimeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontStyle: 'italic',
  }
});

export default Timetable;