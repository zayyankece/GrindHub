import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal, 
  Button, 
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubHeader from '../components/GrindHubHeader';
import GrindHubFooter from '../components/GrindHubFooter';
import io from 'socket.io-client';

const SERVER_URL = "https://grindhub-production.up.railway.app"

const MessageBubble = ({ message, isOwn }) => (
  <View
    style={[
      styles.messageBubbleBase,
      isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
    ]}
  >
    {!isOwn && <Text style={styles.messageUsername}>{message.user}</Text>}
    <Text style={styles.messageText}>{message.msg}</Text>
  </View>
);

const ChatScreen = ({route, navigation}) => {
  // const { groupId, groupName, userId, username } = route.params;
  const groupId = 1
  const groupName = "TEST_GROUP"
  const userId = 1
  const username = "TEST_USER"
  const [isLoading, setIsLoading] = useState(true);

  // const [username, setUsername] = useState('');
  // const [isModalVisible, setModalVisible] = useState(true);
  // const [tempUsername, setTempUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  // Refs for socket and scroll view
  const socketRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Effect hook for Socket.IO connection and events
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
          const response = await fetch("https://grindhub-production.up.railway.app/api/auth/getMessages", {
          method : "POST",
          headers : { 'Content-Type': 'application/json' },
          body : JSON.stringify({
          groupid : 1,
          }),
        });
        
        const data = await response.json();

        if (data.success) {
          // Format the fetched messages to match the live message format
          const formattedMessages = data.messages.map(msg => ({
            id: msg.messageid,
            user: msg.username,
            msg: msg.messagecontent,
            isOwn: msg.userid === userId,
          }));
          setMessages(formattedMessages);
        } else {
          console.error("Failed to fetch chat history:", data.message, data);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [groupId, userId]);

  // Effect for handling the real-time socket connection
  useEffect(() => {
    // Connect to the socket server
    const newSocket = io(SERVER_URL);
    socketRef.current = newSocket;

    // Join the specific group's room on the server
    newSocket.emit('joinGroup', { groupId, username, userId });

    // Listen for new incoming messages
    newSocket.on('chat message', (data) => {
      const newMessage = {
        id: Date.now() + Math.random(),
        user: data.user,
        msg: data.msg,
        isOwn: data.user === username,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Handle notifications
    newSocket.on('user joined', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { id: Date.now(), type: 'notification', msg }]);
    });
    newSocket.on('user left', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { id: Date.now(), type: 'notification', msg }]);
    });

    // Disconnect when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [groupId, userId, username]);

  // Function to send a message
  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      const messageData = {
        user: username,
        msg: message,
      };

      // Emit the message to the server
      socketRef.current.emit('chat message', messageData.msg);

      // --- Optimistic Update ---
      // Add the message to our own screen immediately.
      const newMessage = {
        id: Date.now(),
        ...messageData,
        isOwn: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Clear the input field
      setMessage('');
    }
  };

  // Function to handle joining the chat from the modal
  const handleJoinChat = () => {
      if (tempUsername.trim()) {
          setUsername(tempUsername);
          setModalVisible(false);
      }
  };
  // const [message, setMessage] = useState('');

  // // Mock chat messages
  // const messages = [
  //   { id: 1, isOwn: false, text: "Hey everyone! Ready for tonight's study session?" },
  //   { id: 2, isOwn: false, text: "I've prepared all the materials we need to cover" },
  //   { id: 3, isOwn: true, text: "Perfect! What time should we start?" },
  //   { id: 4, isOwn: false, text: "How about 7 PM? That gives everyone time to finish dinner" },
  //   { id: 5, isOwn: true, text: "Sounds good to me! I'll bring my notes from today's lecture" },
  //   { id: 6, isOwn: false, text: "Great! See you all at 7" },
  // ];

  // const sendMessage = () => {
  //   if (message.trim()) {
  //     // Handle sending message here
  //     console.log('Sending message:', message);
  //     setMessage('');
  //   }
  // };

  // const MessageBubble = ({ message, isOwn }) => (
  //   <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
  //     {!isOwn && <View style={styles.avatar} />}
  //     <View style={[styles.messageBubble, isOwn && styles.ownMessageBubble]}>
  //       <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
  //         {message.text}
  //       </Text>
  //     </View>
  //   </View>
  // );

  // return (
  //   <SafeAreaView style={styles.container}>
  //     <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
  //     {/* Header */}
  //     <GrindHubHeader navigation={navigation}/>

  //     {/* Group Info Card */}
  //     <TouchableOpacity onPress={() => {navigation.navigate("GroupDescription")}}>
  //       <View style={styles.groupInfoContainer}>
  //         <View style={styles.groupInfoCard}>
  //           <View style={styles.groupInfoLeft}>
  //             <Text style={styles.groupTitle}>Only for people with 5.00 GPA</Text>
  //             <Text style={styles.groupMembers}>alex, xela, elax, exal, lexa, ....</Text>
  //           </View>
  //           <View style={styles.groupAvatar} />
  //         </View>
  //       </View>
  //     </TouchableOpacity>

  //     <KeyboardAvoidingView 
  //       style={styles.chatContainer} 
  //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  //     >
  //       {/* Messages */}
  //       <ScrollView 
  //         style={styles.messagesContainer} 
  //         showsVerticalScrollIndicator={false}
  //         contentContainerStyle={styles.messagesContent}
  //       >
  //         {messages.map((msg) => (
  //           <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
  //         ))}
  //       </ScrollView>

  //       {/* Message Input */}
  //       <View style={styles.inputContainer}>
  //         <View style={styles.messageInputContainer}>
  //           <TextInput
  //             style={styles.messageInput}
  //             placeholder="Message"
  //             placeholderTextColor="#999"
  //             value={message}
  //             onChangeText={setMessage}
  //             multiline
  //             maxLength={500}
  //           />
  //           <TouchableOpacity 
  //             style={styles.sendButton} 
  //             activeOpacity={0.7}
  //             onPress={sendMessage}
  //           >
  //             <Ionicons name="send" size={20} color="#FF8C42" />
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </KeyboardAvoidingView>

  //     {/* Bottom Navigation */}
  //     <GrindHubFooter navigation={navigation} activeTab="GroupChat"/>
  //   </SafeAreaView>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      <GrindHubHeader navigation={navigation}/>
      
      <TouchableOpacity onPress={() => navigation.navigate("GroupDescription", { groupId })}>
        <View style={styles.groupInfoContainer}>
          <View style={styles.groupInfoCard}>
            <View style={styles.groupInfoLeft}>
              <Text style={styles.groupTitle}>{groupName}</Text>
              <Text style={styles.groupMembers}>alex, xela, elax, exal, lexa, ....</Text>
            </View>
            <View style={styles.groupAvatar} />
          </View>
        </View>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#FF8C42" style={{ marginTop: 20 }} />
          ) : (
            messages.map((msg) => {
              if (msg.type === 'notification') {
                  return <Text key={msg.id} style={styles.notificationText}>{msg.msg}</Text>;
              }
              return <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />;
            })
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.messageInputContainer}>
            <TextInput style={styles.messageInput} placeholder="Message" value={message} onChangeText={setMessage} multiline />
            <TouchableOpacity style={styles.sendButton} activeOpacity={0.7} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#FF8C42" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <GrindHubFooter navigation={navigation} activeTab="GroupChat"/>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FED7AA',
//   },
//   backButton: {
//     marginRight: 8,
//     padding: 4,
//   },
//   logoContainer: {
//     width: 32,
//     height: 32,
//     backgroundColor: 'black',
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   groupInfoContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   groupInfoCard: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   groupInfoLeft: {
//     flex: 1,
//   },
//   groupTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   groupMembers: {
//     fontSize: 14,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   groupAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#4DD0E1',
//     marginLeft: 12,
//   },
//   chatContainer: {
//     flex: 1,
//   },
//   messagesContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   messagesContent: {
//     paddingVertical: 8,
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     marginBottom: 12,
//     alignItems: 'flex-end',
//   },
//   ownMessageContainer: {
//     justifyContent: 'flex-end',
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#4DD0E1',
//     marginRight: 8,
//   },
//   messageBubble: {
//     backgroundColor: '#E5E7EB',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     maxWidth: '75%',
//     borderBottomLeftRadius: 4,
//   },
//   ownMessageBubble: {
//     backgroundColor: '#3B82F6',
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 4,
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#333',
//     lineHeight: 20,
//   },
//   ownMessageText: {
//     color: 'white',
//   },
//   inputContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingBottom: 16,
//   },
//   messageInputContainer: {
//     backgroundColor: 'white',
//     borderRadius: 25,
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 48,
//   },
//   messageInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     maxHeight: 100,
//     paddingVertical: 8,
//   },
//   sendButton: {
//     padding: 8,
//     marginLeft: 8,
//   }
// });

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { flex: 1 },
  placeholderHeader: { padding: 15, backgroundColor: '#f8f8f8', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  placeholderFooter: { padding: 20, backgroundColor: '#f8f8f8', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
  placeholderHeaderText: { fontWeight: 'bold' },
  groupInfoContainer: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#f9f9f9', borderBottomWidth: 1, borderBottomColor: '#eee' },
  groupInfoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  groupInfoLeft: { flex: 1 },
  groupTitle: { fontWeight: 'bold', fontSize: 16 },
  groupMembers: { fontSize: 12, color: '#666', marginTop: 4 },
  groupAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc', marginLeft: 15 },
  messagesContainer: { flex: 1, paddingHorizontal: 10 },
  messagesContent: { paddingVertical: 10 },
  messageBubbleBase: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, marginVertical: 4, maxWidth: '80%' },
  ownMessageBubble: { backgroundColor: '#FF8C42', alignSelf: 'flex-end' },
  otherMessageBubble: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },
  messageUsername: { fontWeight: 'bold', fontSize: 12, marginBottom: 4, color: '#555' },
  messageText: { color: 'black' },
  notificationText: { textAlign: 'center', color: '#999', marginVertical: 8, fontSize: 12, fontStyle: 'italic' },
  inputContainer: { padding: 10, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff' },
  messageInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 25, paddingHorizontal: 15 },
  messageInput: { flex: 1, paddingVertical: 10, fontSize: 16, maxHeight: 100 },
  sendButton: { marginLeft: 10, padding: 5 },
});

export default ChatScreen;