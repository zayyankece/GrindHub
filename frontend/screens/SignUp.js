import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SignUp({navigation}) {

  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [inputConfirmPassword, setInputConfirmPassword] = useState('')

  const handleSignUpButton = async () => {
    console.log('ha1')
    const response = await fetch("http://localhost:3000/api/auth/signup", {
      method : "POST",
      headers : { 'Content-Type': 'application/json' },
      body : JSON.stringify({
        email : inputEmail,
        password : inputPassword
      }),
    });
    console.log("hihi")
    const data = await response.json()
    if (data.success){
      navigation.navigate("HomePage")
      console.log("success")
    }
    else {
      console.log("error")
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require("../assets/GrindHub Logo.png")} style={{marginBottom:20, marginRight:10}}/>
        <Text style={styles.title}>GrindHub</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subText}>Please sign up to continue</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} keyboardType="email-address" 
        value = {inputEmail}
        onChangeText={setInputEmail}/>

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} secureTextEntry 
        value= {inputPassword}
        onChangeText={setInputPassword}/>

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput style={styles.input} secureTextEntry 
        value = {inputConfirmPassword} 
        onChangeText={setInputConfirmPassword}/>

        <TouchableOpacity style={styles.signupButton} onPress={() => handleSignUpButton()}>
          <Text style={styles.signupText}>Sign Up</Text>
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
  signupButton: {
    backgroundColor: '#ffd23f',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop : 16,
    marginBottom: 16,
  },
  signupText: {
    fontWeight: 'bold',
    color: '#333',
  }
});

