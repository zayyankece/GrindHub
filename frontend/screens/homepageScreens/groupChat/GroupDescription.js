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

// --- FreeTimeModal Component ---
const FreeTimeModal = ({ isVisible, onClose, onSubmit, members }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startHour, setStartHour] = useState(new Date(0, 0, 0, 9, 0)); // Default 9 AM
  const [endHour, setEndHour] = useState(new Date(0, 0, 0, 17, 0));   // Default 5 PM

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartHourPicker, setShowStartHourPicker] = useState(false);
  const [showEndHourPicker, setShowEndHourPicker] = useState(false);

  // Reset states when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setStartDate(new Date());
      setEndDate(new Date());
      setStartHour(new Date(0, 0, 0, 9, 0));
      setEndHour(new Date(0, 0, 0, 17, 0));
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

  const onChangeStartHour = (event, selectedTime) => {
    const currentTime = selectedTime || startHour;
    setShowStartHourPicker(Platform.OS === 'ios');
    setStartHour(currentTime);
  };

  const onChangeEndHour = (event, selectedTime) => {
    const currentTime = selectedTime || endHour;
    setShowEndHourPicker(Platform.OS === 'ios');
    setEndHour(currentTime);
  };

  const handleSubmitPress = () => {
    onSubmit({
      startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
      endDate: endDate.toISOString().split('T')[0],     // YYYY-MM-DD
      startHour: startHour.getHours(),
      endHour: endHour.getHours(),
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
            <TouchableOpacity onPress={() => setShowStartHourPicker(true)} style={modalStyles.dateInput}>
              <Text>{startHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showStartHourPicker && (
              <DateTimePicker
                testID="startHourPicker"
                value={startHour}
                mode="time"
                is24Hour={true} // Use 24-hour format
                display="default"
                onChange={onChangeStartHour}
              />
            )}
          </View>

          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.label}>End Hour:</Text>
            <TouchableOpacity onPress={() => setShowEndHourPicker(true)} style={modalStyles.dateInput}>
              <Text>{endHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showEndHourPicker && (
              <DateTimePicker
                testID="endHourPicker"
                value={endHour}
                mode="time"
                is24Hour={true} // Use 24-hour format
                display="default"
                onChange={onChangeEndHour}
              />
            )}
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
  const handleFindFreeTime = async ({ startDate, startHour, endHour }) => {
    console.log("Finding free time with:", { startDate, startHour, endHour });

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
      console.log("API response for free time:", data);

      if (data.success) {

        const intervals = []

        // const formattedFreeTimes = data.freeTimeSlots.map(slot => {
        //   const startMinutes = slot[0];
        //   const endMinutes = slot[1];

        //   const startH = Math.floor(startMinutes / 60);
        //   const startM = startMinutes % 60;
        //   const endH = Math.floor(endMinutes / 60);
        //   const endM = endMinutes % 60;

        //   const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

        //   return `${formatTime(startH, startM)} - ${formatTime(endH, endM)}`;
        // }).join('\n');

        Alert.alert(
          "Free Time Found!",
          `Within the selected range, the group has free time during:\n\n${formattedFreeTimes}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "No Common Free Time",
          data.message || "Could not find a common free time slot for the group within the specified range.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error finding free time:", error);
      Alert.alert(
        "Error",
        "An error occurred while trying to find free time. Please try again later.",
        [{ text: "OK" }]
      );
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

export default GroupDescription;