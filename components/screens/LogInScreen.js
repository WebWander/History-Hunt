// import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseAuth';

const LogInScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  

  const handleSignUp = async () => {


    console.log(`Email: ${email}, Name: ${name}, Password: ${password}`);

    if (!email || !password) {
      console.error('Email and password are required.');
      return;
    }

    // Simple email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      console.error('Invalid email format.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      console.log('Registered with:', user.email);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  // const handleLogin = async() => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;
  //     console.log('Logged in with:', user.email);
  //   } catch (error) {
  //     console.error('Error signing up:', error.message);
  //   }
  // }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'
    >
      <View style={styles.heading}>
        <Text style={{fontSize: 20}}>Profile</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput 
          placeholder='Name'
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
        />
        <TextInput 
          placeholder='Password'
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>SIGN UP</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '65%',
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '68%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  buttonOutline: {
    marginTop: 5,
    borderWidth: 2,
    width: '100%',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  heading: {
    marginTop: 5,
  }
});
