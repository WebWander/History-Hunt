import { StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import Search from './SearchBar'
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import Button from '../ui/Button';


const friends = [
  { name: 'Alastor', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Albus', selected: true, uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Alice', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Alicia', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Amos', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Angelina', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Barty', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Bathilda', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Bellatrix', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Cedric', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Cho', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Dean', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Dolores', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Dora', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Draco', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Dean', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Dolores', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Dora', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  { name: 'Draco', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  
];

const InviteFriends = () => {
  return (
    <View style={styles.mainContainer}>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back" size={24} color="blue" style={{marginLeft: 20}} />
     </TouchableOpacity>
     <View style={styles.headingContainer}>
      <Text style={styles.headingText}>Invite Friends</Text>
     </View>
     <Search  />
     <View style={styles.avatarContainer}>
        {friends.map((friend, index) => (
          <View key={index} style={styles.avatarItem}>
            <Avatar 
              size={40}
              rounded
              containerStyle={styles.avatar}
              source={{ uri: friend.uri }}
            />
            <Text>{friend.name}</Text>
          </View>
        ))}
        
      </View>
      <Button 
        onPress={() => console.log('Button Pressed')}
        style={styles.customButton}
      >
          <Text style={{color: 'white', fontSize: 16, fontWeight: 900 }}>INVITE</Text>
      </Button>

     
    </View>
  )
}

export default InviteFriends

const styles = StyleSheet.create({
  mainContainer: {
   marginTop: 50,
  },
  headingText: {
    fontSize: 40,
    marginLeft: 20,
  },
  headingContainer: {
    alignItems: 'center',
  },
  
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 50,
    marginLeft: 20,
    marginRight: 50,
    
  },
  avatarItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
    backgroundColor: '#dcdcdc',
    borderRadius: 20,
    
    
    
  },
  avatar: {
    backgroundColor: '#ccc',
  },
  customButton: {
    position: 'absolute',
    bottom: 80, 
    left: 60, 
    right: 60, 
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  
  
  
  
  
});
