import {Text, View,  } from 'react-native'
import React from 'react'
/* import { auth } from '../../firebaseAuth'; */
import { useAuth } from '../../context/authContext';
import { auth } from '../../firebaseConfig';


const HomeScreen = () => {
  const navigation = useNavigation();
const { logout } = useAuth();

const handleSignOut = async () => {
  await logout();
  navigation.navigate('Login');
}
  return (
    <View>
      <Text>Welcome to History Hunt!</Text>
    </View>
  )
}

export default HomeScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//    button: {
//     backgroundColor: '#0782F9',
//     width: '60%',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 40,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: '700',
//     fontSize: 16,
//   },
// })