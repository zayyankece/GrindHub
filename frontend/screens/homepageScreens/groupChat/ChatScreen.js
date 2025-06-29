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
import { jwtDecode } from "jwt-decode";

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
  // const { groupid, groupName, userid, username } = route.params;
  const { token } = route.params
  const decodedToken = jwtDecode(token)
  const userid = decodedToken.userid 
  const groupid = 1
  const groupName = "TEST_GROUP"
  // const userid = 1
  const username = "nabilrakaiza"
  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const socketRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Effect hook for fetching initial chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
          const response = await fetch(`${SERVER_URL}/api/auth/getMessages`, {
          method : "POST",
          headers : { 'Content-Type': 'application/json' },
          body : JSON.stringify({
            groupid: groupid,
          }),
        });
        
        const data = await response.json();

        if (data.success) {
          const formattedMessages = data.messages.map(msg => ({
            id: msg.messageid,
            user: msg.username,
            msg: msg.messagecontent,
            isOwn: msg.userid === userid,
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
  }, [groupid, userid]);

  // Effect for handling the real-time socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL);
    socketRef.current = newSocket;

    newSocket.emit('joinGroup', { groupid, username, userid });

    newSocket.on('chat message', (data) => {
      // Prevent duplicate messages from appearing if the sender is us
      if (data.user === username) return;

      const newMessage = {
        id: Date.now() + Math.random(),
        user: data.user,
        msg: data.msg,
        isOwn: false,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on('user joined', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { id: Date.now(), type: 'notification', msg }]);
    });
    newSocket.on('user left', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { id: Date.now(), type: 'notification', msg }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [groupid, userid, username]);

  // --- MODIFIED FUNCTION ---
  // This function now saves messages to the database via a REST API call.
  const sendMessage = async () => {
    const messageContent = message.trim();
    if (!messageContent) return;

    // Clear input field immediately for a responsive feel
    setMessage('');
    
    // Optimistically update the UI with the new message
    const optimisticMessage = {
      id: Date.now(),
      user: username,
      msg: messageContent,
      isOwn: true,
    };
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);

    try {
      // Persist the message to the database
      const response = await fetch(`${SERVER_URL}/api/auth/addMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupid: groupid,
          userid: userid,
          messagecontent: messageContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // If save is successful, emit the message via WebSocket for other clients
        if (socketRef.current) {
          socketRef.current.emit('chat message', { 
            user: username, 
            msg: messageContent 
          });
        }
      } else {
        console.error('Failed to save message:', data.message);
        // Optional: Add UI feedback to show the message failed to send
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Optional: Add UI feedback for the user
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      <GrindHubHeader navigation={navigation} token={token}/>
      
      <TouchableOpacity onPress={() => navigation.navigate("GroupDescription", { groupid })}>
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

      <GrindHubFooter navigation={navigation} activeTab="GroupChat" token={token}/>
    </SafeAreaView>
  );
};

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
