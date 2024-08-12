import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import Search from './SearchBar';
import Button from '../ui/Button';
import { db } from "../../firebaseConfig";

const InviteFriends = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => doc.data());
      const uniqueUserList = Array.from(new Set(userList.map(user => user.userId)))
        .map(id => userList.find(user => user.userId === id));
      setUsers(uniqueUserList);
    };

    fetchUsers();
  }, []);

  const organizeUsers = (users) => {
    const sections = users.reduce((acc, user) => {
      const firstLetter = user.username.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = { title: firstLetter, data: [] };
      }
      acc[firstLetter].data.push(user);
      return acc;
    }, {});
  
    return Object.values(sections).sort((a, b) => a.title.localeCompare(b.title));
  };
  
  const organizedUsers = organizeUsers(users);

  const renderGridItem = ({ item }) => (
    <View style={styles.avatarItem}>
      <Avatar
        size={50}
        rounded
        containerStyle={[styles.avatar, { backgroundColor: '#ccc' }]}
        icon={{ name: 'user', type: 'font-awesome', color: '#808080' }}
        source={{ uri: item.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
      />
      <Text>{item.username}</Text>
    </View>
  );

  const renderSection = ({ section }) => (
    <View>
      <Text style={styles.sectionHeader}>{section.title}</Text>
      <FlatList
        data={section.data}
        renderItem={renderGridItem}
        numColumns={3}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back" size={24} color="blue" style={{marginLeft: 20}} />
      </TouchableOpacity>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Invite Friends</Text>
      </View>
      <Search  />

      <SectionList
        sections={organizedUsers}
        keyExtractor={(item, index) => item.userId + index}
        renderItem={({ item }) => null} 
        renderSectionHeader={renderSection}
        contentContainerStyle={styles.sectionListContent}
      />

      <Button 
        onPress={() => console.log('Button Pressed')}
        style={styles.customButton}
      >
        <Text style={{color: 'white', fontSize: 16, fontWeight: '900' }}>INVITE</Text>
      </Button>
    </View>
  );
}

export default InviteFriends;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 40,
    flex: 1,
    
  },
  headingText: {
    fontSize: 40,
    marginLeft: 20,
  },
  headingContainer: {
    alignItems: 'center',
  },
  avatarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70, 
    height: 80, 
    marginBottom: 20,
    marginRight: 10,
    backgroundColor: '#ccc', 
    borderRadius: 25, 
    marginLeft: 20,
    
  },
  avatar: {
    backgroundColor: '#ccc', // Consistent color with avatarItem
   
  },
  customButton: {
    position: 'absolute',
    bottom: 90, 
    left: 10, 
    right: 10, 
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '500',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#ffb6c1',
  },
  sectionListContent: {
    paddingHorizontal: 20,
    
  },
});
