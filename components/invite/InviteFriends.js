import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Search from './SearchBar'
import { Ionicons } from '@expo/vector-icons';

const InviteFriends = () => {
  return (
    <View style={styles.mainContainer}>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back" size={24} color="black" style={{marginLeft: 20}} />
     </TouchableOpacity>
     <View style={styles.headingContainer}>
      <Text style={styles.headingText}>Invite Friends</Text>
     </View>
      <Search  cancelIcon={true} />
    </View>
  )
}

export default InviteFriends

const styles = StyleSheet.create({
  mainContainer: {
   marginTop: 50,
  },
  headingText: {
    fontSize: 30,
    marginLeft: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  headingContainer: {
    alignItems: 'center',
  },
})