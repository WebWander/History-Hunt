import React, { useState } from 'react';
import {  StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseAuth';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';


const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');

  

  const handleSignUp = async () => {

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();



    if (!validateEmail(email)) {
      Alert.alert('Invalid email format');
      return;
    }
    if (!name) {
      Alert.alert('Name cannot be empty');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;
      await updateProfile(user, { displayName: trimmedName });
      console.log('Registered with:', user.email);

      setEmail('');
      setPassword('');
      setName('');
      


    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
  };


  

  return(
    <View  style={styles.mainContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back" size={24} color="black" style={{marginLeft: 20}} />
      </TouchableOpacity>
      <View>
        <Image 
          source={require('../../assets/logo.png')}
          style={{marginLeft: 190, width: 50, height: 60}}
          />
      </View>
      <View style={styles.container}>
        <Text style={{fontSize: 30, fontWeight: 500,  color: '#ba55d3', marginBottom: 25}}>History<Text style={{color: '#dda0dd'}}>Hunt</Text></Text>
        <Text style={{fontSize: 40}}>Profile</Text>
      </View>
      <View style={styles.textInputContainer} >
        <TextInput 
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.textInput}
         />
         <TextInput 
          placeholder='Name'
          value={name}
          onChangeText={text => setName(text)}
          style={styles.textInput}
         />
        <TextInput  
          placeholder='Password'
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.textInput} />
          {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
      </View>
      <View>
        <Button
          onPress={handleSignUp}
        >
          <Text style={{color: 'white', fontSize: 16, fontWeight: 900}}>SIGNUP</Text>
        </Button>
      </View>
      <View style={styles.note}>
        <Text style={{fontSize: 13}}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{color: 'blue'}}>Log in here</Text>
        </TouchableOpacity>
        
      </View>
      <View style={styles.terms}>
        <Text style={{fontSize: 12}}>By signing up I accept the <Text style={{textDecorationLine: 'underline'}}>terms of use</Text></Text>
        <Text style={{marginBottom: 20, fontSize: 12}}>And the <Text style={{textDecorationLine: 'underline'}}>data privacy policy</Text></Text>
      </View>

    </View>
  )
  


}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 50
  },
  textInputContainer: {
    marginBottom: 15,
   
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 50,
    padding: 10,
    marginLeft: 90,
    marginRight: 90,
    marginBottom: 15,
    
    
  },
  container: {
   alignItems: 'center',
   padding: 10,
   marginBottom: 10,
   
    
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF', // Customize the button color
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 30,
    
    
  },
  note: {
    alignItems: 'center',
    marginBottom: 10,

  },
  terms: {
    alignItems: 'center',
  }



  
});

export default SignUpScreen;


