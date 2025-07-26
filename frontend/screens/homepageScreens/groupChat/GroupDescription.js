import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal, // Import Modal
  TextInput, // Import TextInput for date/time display
  Platform, // Import Platform for OS-specific logic
  Alert, // Import Alert for confirmations
} from 'react-native';
import GrindHubHeader from '../components/GrindHubHeader';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const FreeTimeSolutionModal = ({ isVisible, onClose, solution, isSolutionFound }) => {
  // Helper function to convert minutes to readable time format
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderSolutionContent = () => {
    if (!isSolutionFound) {
      return (
        <View style={solutionModalStyles.noSolutionContainer}>
          <Text style={solutionModalStyles.noSolutionTitle}>No Common Free Time Found</Text>
          <Text style={solutionModalStyles.noSolutionText}>
            Unfortunately, we couldn't find a common free time slot that meets your requirements within the specified date range and duration.
          </Text>
          <Text style={solutionModalStyles.suggestionText}>
            Try adjusting your search criteria:
          </Text>
          <Text style={solutionModalStyles.suggestionItem}>• Extend the date range</Text>
          <Text style={solutionModalStyles.suggestionItem}>• Reduce the duration requirement</Text>
          <Text style={solutionModalStyles.suggestionItem}>• Adjust the preferred time hours</Text>
        </View>
      );
    }

    return (
      <View style={solutionModalStyles.solutionContainer}>
        <Text style={solutionModalStyles.successTitle}>Free Time Found!</Text>
        <Text style={solutionModalStyles.successSubtitle}>
          Here's when your group can meet:
        </Text>
        
        <ScrollView style={solutionModalStyles.solutionList} showsVerticalScrollIndicator={false}>
          {Array.from(solution.entries()).map(([date, timeSlots]) => (
            <View key={date} style={solutionModalStyles.dateSection}>
              <Text style={solutionModalStyles.dateHeader}>
                {formatDate(date)}
              </Text>
              {timeSlots.map((slot, index) => (
                <View key={index} style={solutionModalStyles.timeSlot}>
                  <Text style={solutionModalStyles.timeText}>
                    {minutesToTime(slot[0])} - {minutesToTime(slot[1])}
                  </Text>
                  <Text style={solutionModalStyles.durationText}>
                    ({slot[1] - slot[0]} minutes)
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={solutionModalStyles.centeredView}>
        <View style={solutionModalStyles.modalView}>
          {renderSolutionContent()}
          
          <TouchableOpacity
            style={[
              solutionModalStyles.closeButton, 
              isSolutionFound ? solutionModalStyles.successButton : solutionModalStyles.errorButton
            ]}
            onPress={onClose}
          >
            <Text style={solutionModalStyles.closeButtonText}>
              {isSolutionFound ? 'Great!' : 'Try Again'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- FreeTimeModal Component ---
const FreeTimeModal = ({ isVisible, onClose, onSubmit, members }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [starttime, setStarttime] = useState(new Date()); // Default 9 AM
  const [endtime, setEndtime] = useState(new Date());   // Default 5 PM
  const [duration, setDuration] = useState(120); // Default duration in minutes

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStarttimePicker, setShowStarttimePicker] = useState(false);
  const [showEndtimePicker, setShowEndtimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  // Reset states when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setStartDate(new Date());
      setEndDate(new Date());
      setStarttime(new Date()); 
      setEndtime(new Date());
      setDuration(120);
    }
  }, [isVisible]);

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const onChangeStarttime = (event, selectedTime) => {
    const currentTime = selectedTime || starttime;
    setShowStarttimePicker(Platform.OS === 'ios');
    setStarttime(currentTime);
  };

  const onChangeEndtime = (event, selectedTime) => {
    const currentTime = selectedTime || endtime;
    setShowEndtimePicker(Platform.OS === 'ios');
    setEndtime(currentTime);
  };

  const onChangeDuration = (event, selectedDuration) => {
    const currentDuration = selectedDuration || duration;
    setDuration(currentDuration);
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleSubmitPress = () => {
    onSubmit({
      startdate: formatDate(startDate), // YYYY-MM-DD
      enddate: formatDate(endDate),     // YYYY-MM-DD
      starttime: starttime.getHours() * 60 + starttime.getMinutes(), // Convert to minutes
      endtime: endtime.getHours() * 60 + endtime.getMinutes(), // Convert to minutes
      duration: parseInt(duration), // Duration in minutes
    });
    onClose(); // Close modal after submission
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Find Free Time</Text>

          {/* Date Range */}
          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.label}>Start Date:</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={modalStyles.dateInput}>
              <Text>{startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                testID="startDatePicker"
                value={startDate}
                mode="date"
                display="default"
                onChange={onChangeStartDate}
              />
            )}
          </View>

          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.label}>End Date:</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={modalStyles.dateInput}>
              <Text>{endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                testID="endDatePicker"
                value={endDate}
                mode="date"
                display="default"
                onChange={onChangeEndDate}
              />
            )}
          </View>

          {/* Time Range */}
          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.label}>Start Hour:</Text>
            <TouchableOpacity onPress={() => setShowStarttimePicker(true)} style={modalStyles.dateInput}>
              <Text>{starttime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showStarttimePicker && (
              <DateTimePicker
                testID="starttimePicker"
                value={starttime}
                mode="time"
                is24Hour={true} // Use 24-hour format
                display="default"
                onChange={onChangeStarttime}
              />
            )}
          </View>

          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.label}>End Hour:</Text>
            <TouchableOpacity onPress={() => setShowEndtimePicker(true)} style={modalStyles.dateInput}>
              <Text>{endtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showEndtimePicker && (
              <DateTimePicker
                testID="endtimePicker"
                value={endtime}
                mode="time"
                is24Hour={true} // Use 24-hour format
                display="default"
                onChange={onChangeEndtime}
              />
            )}
          </View>

          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.label}>Duration :</Text>
              <TextInput
                style={modalStyles.dateInput}
                value={duration}
                onChangeText={setDuration}
                placeholder='Duration in minutes'
                keyboardType='numeric'
                defaultValue='120'
              />
          </View>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonSubmit]}
              onPress={handleSubmitPress}
            >
              <Text style={modalStyles.textStyle}>Find Free Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonClose]}
              onPress={onClose}
            >
              <Text style={modalStyles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const GroupDescription = ({ route, navigation }) => {
  const { groupid } = route.params

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
  // const { groupId } = route.params;

  // --- State Management ---
  const [invitationcode, setInvitationcode] = useState("")
  const [groupDetails, setGroupDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [isSolutionModalVisible, setIsSolutionModalVisible] = useState(false);
  const [solutionResult, setSolutionResult] = useState(null);
  const [isSolutionFound, setIsSolutionFound] = useState(false);

  // --- Data Fetching ---
  // This useEffect hook fetches all necessary data when the screen loads.
  useEffect(() => {
    const fetchGroupDetails = async () => {
      // Fetch description from your API
      try {
        const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getDescription", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groupid: groupid,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setGroupDetails(data.description);
          setInvitationcode(data.description[0].invitationcode)

          const extractedUser = data.description.map(members => ({
            id: members.userid,
            username: members.username,
          }));
          setMembers(extractedUser)
          setIsLoading(false)

        } else {
          console.error("Failed to fetch group description:", data.message);
        }
      } catch (error) {
        console.error("Error fetching group description:", error);
      }

    };

    fetchGroupDetails();
  }, []); // Dependency array ensures this runs when groupId changes.

  // --- Free Time Calculation Logic (Helper Function) ---
  // This is the JavaScript version of the Python function you provided.
  // We will integrate this or a similar logic with the actual API call.
  const findFreeTimeLogic = (intervals) => {
    if (!intervals || intervals.length === 0) {
      return [[0, 1440]]; // Assuming 0-1440 minutes represents the full day if no intervals
    }

    intervals.sort((a, b) => a[0] - b[0]);

    let freeTimes = [];
    let endTime = intervals[0][1];

    for (let i = 1; i < intervals.length; i++) {
      let start = intervals[i][0];
      let end = intervals[i][1];

      if (start > endTime) {
        freeTimes.push([endTime, start]);
      }
      endTime = Math.max(endTime, end);
    }

    // If there's free time after the last interval, add it.
    // Assuming 1440 minutes (24 hours) as the end of the day.
    if (endTime < 1440) {
      freeTimes.push([endTime, 1440]);
    }
    return freeTimes;
  };

  // --- Handler Function for Finding Free Time ---
  const handleFindFreeTime = async ({ startdate, enddate, starttime, endtime, duration }) => {
    try {
      // Example of a backend call (you need to implement this API endpoint)
      const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getGroupMemberClassTime", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}` // Send token for authentication
        },
        body: JSON.stringify({
          groupid: groupid,
        }),
      });

      const data = await response.json();

      if (data.success) {

        const intervalsMaps = new Map()
        for (const comp in data.classTime) {
          const component = data.classTime[comp];
          if (intervalsMaps.has(component.startdate) === false) {
            intervalsMaps.set(component.startdate, [])
          }
          intervalsMaps.get(component.startdate).push([component.starttime, component.endtime]);
        }

        const startDate = new Date(startdate);
        const endDate = new Date(enddate);

        const freeTimesArray = new Map()

        while (startDate <= endDate) {
          if (intervalsMaps.has(startDate.toISOString())){
            const intervals = intervalsMaps.get(startDate.toISOString());
            intervals.sort((a, b) => a[0] - b[0]); // Sort intervals by start time

            const freeTimes = findFreeTimeLogic(intervals);
            if (freeTimes.length > 0) {
              freeTimesArray.set(startDate.toISOString(), freeTimes);
            }
          } else {
            freeTimesArray.set(startDate.toISOString(), [[0, 1440]]);
          }
          startDate.setDate(startDate.getDate() + 1); // Move to the next day
        }

        let durationLeft = duration
        let isSolutionFound = false;

        const solution = new Map()

        freeTimesArray.forEach (function(value, key){

          if (isSolutionFound == false){
            let dayStarttime = starttime
            let dayStartend = endtime

            for (let val in value) {
              if (solution.has(key) === false){
                solution.set(key, [])
              }
              if (dayStarttime < value[val][0] && dayStarttime < value[val][1]){
                dayStarttime = Math.max(value[val][0], dayStarttime)
                dayStartend = Math.min(value[val][1], dayStartend)
                if (dayStarttime + durationLeft > dayStartend) {
                  solution.get(key).push([dayStarttime, dayStartend])
                  durationLeft -= (dayStartend - dayStarttime);
                  dayStarttime = dayStartend;
                } else {
                  solution.get(key).push([dayStarttime, dayStarttime + durationLeft])
                  isSolutionFound = true;
                  break
                }
              }
              else if (dayStarttime >= value[val][0] && dayStarttime < value[val][1]){
                dayStarttime = Math.max(value[val][0], dayStarttime)
                dayStartend = Math.min(value[val][1], dayStartend)
                if (dayStarttime + durationLeft > dayStartend) {
                  solution.get(key).push([dayStarttime, dayStartend])
                  durationLeft -= (dayStartend - dayStarttime);
                  dayStarttime = dayStartend;
                } else {
                  solution.get(key).push([dayStarttime, dayStarttime + durationLeft])
                  isSolutionFound = true;
                  break
                }
              } else {
                continue
              }
            }
          }
        })

        if (isSolutionFound) {
          // Set the solution data and show modal
          setSolutionResult(solution);
          setIsSolutionFound(true);
          setIsSolutionModalVisible(true);
        } else {
          // Set no solution and show modal
          setSolutionResult(null);
          setIsSolutionFound(false);
          setIsSolutionModalVisible(true);
        }
        
      } else {
          console.error("Data fetching failed:", data.message);
          // Show error in the solution modal
          setSolutionResult(null);
          setIsSolutionFound(false);
          setIsSolutionModalVisible(true);
      }

    } catch (error) {
      console.error("Error finding free time:", error);
      // Show error in the solution modal
      setSolutionResult(null);
      setIsSolutionFound(false);
      setIsSolutionModalVisible(true);
    }
  };


  // --- Child Component for List Items ---
  const MemberItem = ({ member }) => (
    <TouchableOpacity style={styles.memberItem} activeOpacity={0.7}>
      <View style={styles.memberAvatar} />
      <Text style={styles.memberName}>{member.username}</Text>
    </TouchableOpacity>
  );

  // --- Render Logic ---
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <GrindHubHeader navigation={navigation} />
        <ActivityIndicator size="large" color="#FF8C42" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />

      <GrindHubHeader navigation={navigation} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.groupInfoSection}>
          <View style={styles.groupAvatar} />
          <Text style={styles.groupTitle}>{groupDetails[0]?.groupname || 'Loading...'}</Text>
          <Text style={styles.memberCount}>{members.length} members</Text>
          <Text style={styles.memberCount}>Invitation code: {invitationcode}</Text>
        </View>

        <View style={styles.membersSection}>
          {members.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))}
        </View>

        <View style={styles.findFreeTimeSection}>
          <TouchableOpacity
            style={styles.findFreeTimeButton}
            onPress={() => setIsModalVisible(true)} // Open the modal
          >
            <Text style={styles.findFreeTimeButtonText}>Find Common Free Time</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Free Time Modal */}
      <FreeTimeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleFindFreeTime}
        members={members} // Pass members if needed for logic inside modal (e.g., displaying names)
      />

      <FreeTimeSolutionModal
        isVisible={isSolutionModalVisible}
        onClose={() => setIsSolutionModalVisible(false)}
        solution={solutionResult}
        isSolutionFound={isSolutionFound}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED7AA',
  },
  scrollContainer: {
    flex: 1,
  },
  groupInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  groupAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4F46E5',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#06B6D4',
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  memberCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  membersSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4DD0E1',
    marginRight: 16,
  },
  memberName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 80,
  },
  findFreeTimeSection: {
    padding: 20,
    alignItems: 'center',
  },
  findFreeTimeButton: {
    backgroundColor: '#FF8C42',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  findFreeTimeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)', // Dim background
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Make modal wider
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonSubmit: {
    backgroundColor: '#4CAF50', // Green for submit
  },
  buttonClose: {
    backgroundColor: '#F44336', // Red for close
  },
});

const solutionModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  // Success styles
  solutionContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  solutionList: {
    width: '100%',
    maxHeight: 300,
  },
  dateSection: {
    marginBottom: 20,
    width: '100%',
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#E8F5E8',
    marginVertical: 3,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  // No solution styles
  noSolutionContainer: {
    alignItems: 'center',
    width: '100%',
  },
  noSolutionIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  noSolutionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 15,
    textAlign: 'center',
  },
  noSolutionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  suggestionItem: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
    textAlign: 'center',
  },
  // Button styles
  closeButton: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginTop: 20,
    minWidth: 120,
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  errorButton: {
    backgroundColor: '#FF8C42',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default GroupDescription;