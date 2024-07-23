import React, { useState } from 'react';
import {  StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseAuth';
import { LinearGradient } from 'expo-linear-gradient';



const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  

  const handleSignUp = async () => {

    email = email.trim();
    password = password.trim();
    name = name.trim();

    
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (!name) {
      setError('Name cannot be empty');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
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

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
  };


  

  return(
    <View  style={styles.mainContainer}>
      <View>
        <Image 
          source={require('../../assets/logo.png')}
          style={{marginLeft: 170, width: 50, height: 55}}
          />
      </View>
      <View style={styles.container}>
        <Text style={{fontSize: 30, fontStyle: 'italic',  color: '#ba55d3', marginBottom: 25}}>History<Text style={{color: '#dda0dd'}}>Hunt</Text></Text>
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
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <View>
        <TouchableOpacity
            onPress={handleSignUp}
            // style={[styles.button, styles.buttonOutline]}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={['#1C3AFA', '#9B3DFD', '#B73FFC']}
              style={styles.button}
            >
              <Text style={{color: 'white', fontSize: 16, fontWeight: 600}}>SIGNUP</Text>
            </LinearGradient>

            {/* <Text style={styles.buttonOutlineText}>SIGN UP</Text> */}
        </TouchableOpacity>
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
    marginTop: 100
  },
  textInputContainer: {
    marginBottom: 15,
   
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 50,
    padding: 10,
    marginLeft: 70,
    marginRight: 70,
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
    marginLeft: 50,
    marginRight: 50,
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

export default SignUp;


