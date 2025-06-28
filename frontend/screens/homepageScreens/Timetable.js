import React, { useState, useEffect, useMemo } from 'react';
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
import GrindHubHeader from './components/GrindHubHeader';
import GrindHubFooter from './components/GrindHubFooter';

// --- HELPER FUNCTIONS ---

// Gets the date part of an ISO string (e.g., "2025-05-29")
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

  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - daysToSubtract);
    mondayDate.setHours(0, 0, 0, 0);
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

  const groupedEvents = useMemo(() => {
    const sorted = [...combinedData].sort((a, b) => new Date(a.time) - new Date(b.time));
    return sorted.reduce((acc, event) => {
        const dateKey = getDateKey(event.time);
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
                              return null;
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

    console.log("left arrow pressed")
    console.log(weekStartDate)
  };
  
  const rightArrowPressed = () => {
    setWeekStartDate(currentMonday => {
      const newMonday = new Date(currentMonday);
      newMonday.setDate(currentMonday.getDate() + 7);
      return newMonday;
    });

    console.log("right arrow pressed")
    console.log(weekStartDate)
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        </ScrollView>
  
        {/* Bottom Navigation */}
        <GrindHubFooter navigation={navigation} activeTab="Timetable"/>
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
  
        {/* Bottom Navigation */}
        <GrindHubFooter navigation={navigation} activeTab="Timetable"/>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED7AA',
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
    marginBottom: 6,
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