import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import  Button  from '../ui/Button';
/* import  Loading  from '../Loading'; */
import { useAuth } from '../../context/authContext';


const LogInScreen = ({ navigation }) => {
/*   const [loading, setLoading] = useState(false); */
  const { login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

   /*  setLoading(true); */

  
    try {
      const response = await login(email, password);
      console.log('User logged in:', response);
      if (response.success) {
        Alert.alert('Success', 'User logged in successfully');
        navigation.navigate('Profile'); // Redirect to Profile screen after successful login
      } else {
        Alert.alert('Error', response.msg);
      }
    } catch (error) {
      console.error('Error  logging in:', error.message);
      Alert.alert('Error', error.message);
    } finally {
     /*  setLoading(false); */
    }
  
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Image
          source={require('../../assets/logo.png')}
          style={{ marginLeft: 190, width: 50, height: 55 }}
        />
      </View>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontStyle: 'italic', color: '#ba55d3', marginBottom: 25 }}>
          History<Text style={{ color: '#dda0dd' }}>Hunt</Text>
        </Text>
        <Text style={{ fontSize: 40 }}>Log In</Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
        />
        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.textInput}
        />
      </View>
      <View>
     {/*    {loading ? (
          <View style={{ alignItems: 'center' }}>
            <Loading />
          </View>
        ) : ( */}
          <Button onPress={handleLogin}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '900' }}>CONTINUE</Text>
          </Button>
      {/*   )} */}
      </View>
      <View style={styles.note}>
        <Text style={{ fontSize: 13 }}>Need to make an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: 'blue' }}>Sign up here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 85
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

export default LogInScreen;

