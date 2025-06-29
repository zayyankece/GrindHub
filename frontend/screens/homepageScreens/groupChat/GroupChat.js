import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator, // Import ActivityIndicator for loading state
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubHeader from '../components/GrindHubHeader';
import GrindHubFooter from '../components/GrindHubFooter';
import { jwtDecode } from "jwt-decode";

const GroupChat = ({ navigation, route }) => {
  const { token } = route.params
  const decodedToken = jwtDecode(token)
  const userid = decodedToken.userid 
  // --- State Management ---
  // const userid = "0d3f62b2-35fa-4074-a8e4-1c7681f646de"
  // const username = "nabilrakaiza"
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // --- Data Fetching ---
  // This useEffect hook now correctly fetches data when the component first loads.
  useEffect(() => {
    // We define an async function inside the effect to fetch the data.
    const fetchGroups = async () => {
      // console.log(typeof userid, userid)
      try {
        const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getGroups", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          userid: userid,
          }),
        }); 

        const data = await response.json();
        console.log(data)

        if (data.success) {
          setGroups(data.groups); // Set the fetched groups into our state
        } else {
          console.error("Failed to fetch groups:", data.message);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false); // Stop the loading indicator, even if it fails
      }
    };

    fetchGroups();
  }, []); // The empty dependency array [] ensures this runs only ONCE.

  // --- Child Component for List Items ---
  // This handles rendering and navigation for each group.
  const GroupListItem = ({ group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to the ChatScreen and pass necessary data
        navigation.navigate("ChatScreen", {
          groupid: group.groupid,
          groupname: group.groupname,
          userid: userid, // Pass the dynamic user ID here as well
          username: username, // Pass the dynamic username
        });
      }}
    >
      <View style={styles.groupLeft}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
        <View style={styles.groupContent}>
          <Text style={styles.groupTitle}>{group.groupname}</Text>
          <View style={styles.subtitleContainer}>
            <Ionicons name="chatbubble" size={12} color="#666" />
            <Text style={styles.groupSubtitle}>this is a subtitle (not yet implemented)</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      <GrindHubHeader navigation={navigation} token={token}/>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>
      </View>

      {/* Conditionally render loading indicator or the list */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF8C42" style={{ flex: 1 }} />
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            // Use the groupid from your database as the key
            <GroupListItem key={group.groupid} group={group} />
          ))}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
          <Text style={styles.joinButtonText}>Join / Create More Groups!</Text>
        </TouchableOpacity>
      </View>

      <GrindHubFooter navigation={navigation} activeTab="GroupChat" token={token}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED7AA',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  groupItem: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    marginBottom: 4,
  },
  groupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4DD0E1',
  },
  groupContent: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupSubtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 4,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  joinButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  joinButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  }
});

export default GroupChat;
