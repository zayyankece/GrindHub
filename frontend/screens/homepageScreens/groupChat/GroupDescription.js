import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubHeader from '../components/GrindHubHeader';
import GrindHubFooter from '../components/GrindHubFooter';

const GroupDescription = ({ route, navigation }) => {
  // const { groupId } = route.params;

  // --- State Management ---
  const [groupid, setGroupid] = useState("1")
  const [groupDetails, setGroupDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
            groupid: "1",
          }),
        });
        
        const data = await response.json();
        console.log(data)
        console.log(data.description)

        if (data.success) {
          setGroupDetails(data.description);

          const extractedUser = data.description.map(members => ({
            id: members.userid, 
            username: members.userid,
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
        <GrindHubHeader navigation={navigation}/>
        <ActivityIndicator size="large" color="#FF8C42" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      <GrindHubHeader navigation={navigation}/>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.groupInfoSection}>
          <View style={styles.groupAvatar} />
          <Text style={styles.groupTitle}>{groupDetails[0]?.groupname || 'Loading...'}</Text>
          <Text style={styles.memberCount}>{members.length} members</Text>
        </View>

        <View style={styles.membersSection}>
          {members.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <GrindHubFooter navigation={navigation} activeTab="GroupChat"/>
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
  }
});

export default GroupDescription;
