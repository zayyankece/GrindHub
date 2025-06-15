import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({navigation}) => {
  const [message, setMessage] = useState('');

  // Mock chat messages
  const messages = [
    { id: 1, isOwn: false, text: "Hey everyone! Ready for tonight's study session?" },
    { id: 2, isOwn: false, text: "I've prepared all the materials we need to cover" },
    { id: 3, isOwn: true, text: "Perfect! What time should we start?" },
    { id: 4, isOwn: false, text: "How about 7 PM? That gives everyone time to finish dinner" },
    { id: 5, isOwn: true, text: "Sounds good to me! I'll bring my notes from today's lecture" },
    { id: 6, isOwn: false, text: "Great! See you all at 7" },
  ];

  const sendMessage = () => {
    if (message.trim()) {
      // Handle sending message here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const MessageBubble = ({ message, isOwn }) => (
    <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
      {!isOwn && <View style={styles.avatar} />}
      <View style={[styles.messageBubble, isOwn && styles.ownMessageBubble]}>
        <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="time" size={20} color="white" />
          </View>
          <Text style={styles.headerTitle}>GrindHub</Text>
        </View>
        <Ionicons name="person" size={24} color="black" />
      </View>

      {/* Group Info Card */}
      <TouchableOpacity onPress={() => {navigation.navigate("GroupDescription")}}>
        <View style={styles.groupInfoContainer}>
          <View style={styles.groupInfoCard}>
            <View style={styles.groupInfoLeft}>
              <Text style={styles.groupTitle}>Only for people with 5.00 GPA</Text>
              <Text style={styles.groupMembers}>alex, xela, elax, exal, lexa, ....</Text>
            </View>
            <View style={styles.groupAvatar} />
          </View>
        </View>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView 
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
          ))}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              activeOpacity={0.7}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={20} color="#FF8C42" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} activeOpacity={0.7}>
          <Ionicons name="people" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="calendar" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="time" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="bag" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
  },
  header: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  logoContainer: {
    width: 32,
    height: 32,
    backgroundColor: 'black',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  groupInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  groupInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupInfoLeft: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4DD0E1',
    marginLeft: 12,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4DD0E1',
    marginRight: 8,
  },
  messageBubble: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '75%',
    borderBottomLeftRadius: 4,
  },
  ownMessageBubble: {
    backgroundColor: '#3B82F6',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  messageInputContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 48,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  bottomNav: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    padding: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
});

export default ChatScreen;