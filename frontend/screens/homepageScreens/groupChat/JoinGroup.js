import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GrindHubHeader from '../components/GrindHubHeader';
import GrindHubFooter from '../components/GrindHubFooter';
import { jwtDecode } from "jwt-decode";

const JoinGroup = ({navigation, route}) => {
    const { token } = route.params
    const decodedToken = jwtDecode(token)
    const userid = decodedToken.userid 
    const [invitationCode, setInvitationCode] = useState('');
  
    const handleJoinGroup = async () => {
      // Handle join group logic here
      try {
        const response = await fetch(`${SERVER_URL}/api/auth/joinGroup`, {
            method : "POST",
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                invitationcode: invitationCode,
                userid:userid
            }),
        });

        const data = await response.json();

        if (data.success) {
            setInvitationCode('')
            navigation.navigate("GroupChat", {token:token})
        }
        else {
            console.error("there are some error")
        }
      } catch (error) {
        console.log("there are some error", error)
      }
      console.log('Joining group with code:', invitationCode);
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <GrindHubHeader navigation={navigation} token={token}/>
          
          <View style={styles.content}>
            <Text style={styles.title}>Join New Group</Text>
            
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Group Invitation Code</Text>
                <TextInput
                  style={styles.input}
                  value={invitationCode}
                  onChangeText={setInvitationCode}
                  placeholder="Enter invitation code"
                  placeholderTextColor="#999"
                />
              </View>
              
              <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
                <Text style={styles.buttonText}>Join Group</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <GrindHubFooter navigation={navigation} activeTab="GroupChat" token={token}/>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2D2D2D',
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    content: {
      flex: 1,
      backgroundColor: '#E8D5C4',
      paddingHorizontal: 24,
      paddingTop: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: 40,
    },
    formContainer: {
      flex: 1,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#D1C4B8',
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      color: '#333',
      minHeight: 50,
    },
    textArea: {
      minHeight: 100,
      paddingTop: 16,
    },
    button: {
      backgroundColor: '#FFD700',
      borderRadius: 8,
      paddingVertical: 16,
      paddingHorizontal: 32,
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
  });


export default JoinGroup;