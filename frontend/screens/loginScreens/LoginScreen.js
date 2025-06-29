import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';

export default function LoginScreen({navigation}) {

  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [inputColorEmail, setInputColorEmail] = useState('#e0e0e0');
  const [inputColorPassword, setInputColorPassword] = useState('#e0e0e0');
  const [invalidInput, setInvalidInput] = useState('')

  const resetToDefault = () =>{
    setInputColorPassword("#e0e0e0")
    setInputColorEmail("#e0e0e0")
    setInvalidInput("")
  }

  const handleLoginButton = async () => {
    isValid = true
    if (inputEmail == ""){
      setInputColorEmail("#ffb09c")
      isValid = false
    }
    else{
      setInputColorEmail("#e0e0e0")
    }

    if (inputPassword == ""){
      setInputColorPassword("#ffb09c")
      isValid = false
    }
    else{
      setInputColorPassword("#e0e0e0")
    }

    if (isValid == false){
      setInvalidInput("Please don't leave email/password empty")
      return
    }

    try {
      const response = await fetch("https://grindhub-production.up.railway.app/api/auth/login", {
      method : "POST",
      headers : { 'Content-Type': 'application/json' },
      body : JSON.stringify({
        email : inputEmail,
        password : inputPassword
      }),
    });
  
    const data = await response.json()
    if (data.success){
      resetToDefault()
      // console.log(data.token)
      // console.log(typeof data.token)
      navigation.navigate("HomePage", { token: data.token })
    }
    else {
      console.log("test")
      setInputColorPassword("#ffb09c")
      setInputColorEmail("#ffb09c")
      setInvalidInput("Invalid username or password.")
    }
    }
    catch (error){
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require("../../assets/GrindHub Logo.png")} style={{marginBottom:20, marginRight:10}}/>
        <Text style={styles.title}>GrindHub</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subText}>Please log in to continue</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={[styles.input, {backgroundColor:inputColorEmail}]} keyboardType="email-address" 
        value = {inputEmail}
        onChangeText={setInputEmail}/>

        <Text style={styles.label}>Password</Text>
        <TextInput style={[styles.input, {backgroundColor:inputColorPassword}]} secureTextEntry 
        value= {inputPassword}
        onChangeText={setInputPassword}/>

        <Text style={[styles.subText, {marginBottom : 5, fontSize:12, color : "#ee2400"}]}>{invalidInput}</Text>

        {/* Will implement this in ms3 */}
        {/* <TouchableOpacity onPress={() => {resetToDefault();navigation.navigate("ForgotPassword")}}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.loginButton} onPress={() => handleLoginButton()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => {resetToDefault();navigation.navigate("SignUp")}}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
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
  forgotText: {
    color: '#f27d42',
    marginBottom: 16,
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: '#ffd23f',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    fontWeight: 'bold',
    color: '#333',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#f27d42',
    fontWeight: 'bold',
  },
});

