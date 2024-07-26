import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Search from './SearchBar'
import { Ionicons } from '@expo/vector-icons';

const InviteFriends = () => {
  return (
    <View>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back" size={24} color="black" style={{marginLeft: 20}} />
     </TouchableOpacity>
      <Text>Invite Friends</Text>
      <Search  cancelIcon={true}/>
    </View>
  )
}

export default InviteFriends

const styles = StyleSheet.create({})