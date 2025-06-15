import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function ConfirmationSignUp({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require("../../assets/GrindHub Logo.png")} style={{marginBottom:20, marginRight:10}}/>
        <Text style={styles.title}>GrindHub</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.welcomeText}>Your Account Has Been Created!</Text>
        <Text style={styles.subText}>Please proceed to the login page to continue</Text>

        <TouchableOpacity style={styles.confirmButton} onPress={() => {navigation.navigate('LoginScreen')}}>
          <Text style={styles.confirmText}>Login Page</Text>
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
  confirmButton: {
    backgroundColor: '#ffd23f',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop : 16,
    marginBottom: 16,
  },
  confirmText: {
    fontWeight: 'bold',
    color: '#333',
  }
});

