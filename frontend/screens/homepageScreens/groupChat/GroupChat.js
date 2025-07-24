import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubHeader from '../components/GrindHubHeader';
import GrindHubFooter from '../components/GrindHubFooter';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';

const { width, height } = Dimensions.get('window');

const GroupChat = ({navigation}) => {
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
  
  // --- State Management ---
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [latestMessages, setLatestMessages] = useState(new Map());
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // --- Modal Animation Effect ---
  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  // --- Data Fetching ---
  useEffect(() => {
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

    const getAllLatestMessages = async (currentUserId) => { // Accepts userid as parameter 
      try {
        const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getAllLatestMessages", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid: currentUserId }),
        });
        const data = await response.json();
  
        if (data.success){
          const latestMessagesMap = new Map();
          for (let i = 0; i < data.messages.length; i++) {
            const message = data.messages[i];
            latestMessagesMap.set(message.groupid, message.messagecontent);// Log each message for debugging
          }
          setLatestMessages(latestMessagesMap);
        }
        else {
          console.error("Failed to fetch latest messages:", data.message);
          return [];
        }
  
      } catch (error) {
        console.error("Error fetching assignments:", error);
        return [];
      }
    };

    getAllLatestMessages(userid); // Fetch latest messages for the current user
    fetchGroups();
  }, []);

  // --- Modal Handlers ---
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCreateGroup = () => {
    setModalVisible(false);
    // Navigate to Create Group screen
    navigation.navigate('CreateGroup');
  };

  const handleJoinGroup = () => {
    setModalVisible(false);
    // Navigate to Join Group screen
    navigation.navigate('JoinGroup');
  };

  // --- Child Component for List Items ---
  const GroupListItem = ({ group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("ChatScreen", {
          groupid: group.groupid,
          groupname: group.groupname
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
            <Text style={styles.groupSubtitle}>{latestMessages.get(group.groupid)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      <GrindHubHeader navigation={navigation}/>

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

      {isLoading ? (
        <ActivityIndicator size="large" color="#FF8C42" style={{ flex: 1 }} />
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            <GroupListItem key={group.groupid} group={group} />
          ))}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.joinButton} 
          activeOpacity={0.8}
          onPress={handleOpenModal}
        >
          <Text style={styles.joinButtonText}>Join / Create More Groups!</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Component */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <Animated.View 
          style={[
            styles.overlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity 
            style={styles.overlayTouchable} 
            activeOpacity={1} 
            onPress={handleCloseModal}
          >
            <Animated.View 
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                }
              ]}
            >
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Choose an Option</Text>
                  <Text style={styles.modalSubtitle}>What would you like to do?</Text>
                  
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.createButton]} 
                      onPress={handleCreateGroup}
                      activeOpacity={0.8}
                    >
                      <View style={styles.buttonIcon}>
                        <Text style={styles.iconText}>+</Text>
                      </View>
                      <View style={styles.buttonTextContainer}>
                        <Text style={styles.modalButtonText}>Create Group</Text>
                        <Text style={styles.modalButtonSubtext}>Start a new group</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.joinButtonModal]} 
                      onPress={handleJoinGroup}
                      activeOpacity={0.8}
                    >
                      <View style={styles.buttonIcon}>
                        <Text style={styles.iconText}>→</Text>
                      </View>
                      <View style={styles.buttonTextContainer}>
                        <Text style={styles.modalButtonText}>Join Group</Text>
                        <Text style={styles.modalButtonSubtext}>Enter with invite code</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleCloseModal}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

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
  },
  
  // Modal styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 350,
  },
  modalContent: {
    backgroundColor: '#FED7AA',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  createButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  joinButtonModal: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonTextContainer: {
    flex: 1,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  modalButtonSubtext: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
});

export default GroupChat;