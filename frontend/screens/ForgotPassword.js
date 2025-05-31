import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function ForgotPassword({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require("../assets/GrindHub Logo.png")} style={{marginBottom:20, marginRight:10}}/>
        <Text style={styles.title}>GrindHub</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subText}>Please write your email, we will send a confirmation email!</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} keyboardType="email-address" />

        <TouchableOpacity style={styles.sendButton} onPress={() => {navigation.navigate('ConfirmationForgotPassword')}}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce9db',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff8c00',
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: '#fefaf4',
    width: '100%',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: '#ffd23f',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  sendText: {
    fontWeight: 'bold',
    color: '#333',
  }
});

