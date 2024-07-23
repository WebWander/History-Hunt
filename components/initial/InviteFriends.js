import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from 'react-native-elements';

export default function App() {
  const friends = [
    { name: 'Alice', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Aro', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Bella', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Carlisle', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Charlie', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Demetri', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Emmett', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Esme', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Jacob', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Jane', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Jasper', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Leah', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Marcus', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Renesmee', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    { name: 'Rosalie', uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    
    
  ];

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Invite Friends</Text>
      </View>
      
      <View style={styles.textInput}>
        <TextInput placeholder='Search' />
      </View>

      <View style={styles.avatarContainer}>
        {friends.map((friend, index) => (
          <View key={index} style={styles.avatarItem}>
            <Avatar 
              rounded
              containerStyle={styles.avatar}
              source={{ uri: friend.uri }}
            />
            <Text>{friend.name}</Text>
          </View>
        ))}
      </View>

      <View>
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['#1C3AFA', '#9B3DFD', '#B73FFC']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>INVITE</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    alignItems: 'center',
    marginTop: 80,
  },
  titleText: {
    fontSize: 30,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 50,
    padding: 10,
    marginVertical: 15,
    marginHorizontal: 60,
    color: 'black',
    marginBottom: 30
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  avatar: {
    height: 30,
    width: 30,
  },
  button: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 100,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
});
