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
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }));
      const uniqueUserList = Array.from(new Set(userList.map(user => user.userId)))
        .map(id => userList.find(user => user.userId === id));
      setUsers(uniqueUserList);
    };

    fetchUsers();
  }, []);

  const organizeUsers = (users, selectedUsers) => {
    const sections = users.reduce((acc, user) => {
      const firstLetter = user.username.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = { title: firstLetter, data: [] };
      }
      acc[firstLetter].data.push(user);
      return acc;
    }, {});
  
    const selectedUsernames = users
      .filter(user => selectedUsers.includes(user.userId))
      .map(user => user.username);

    return {
      selectedUsernames,
      sections: Object.values(sections).sort((a, b) => a.title.localeCompare(b.title))
    };
  };

  const { selectedUsernames, sections } = organizeUsers(users, selectedUsers);

  const handleAvatarPress = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const renderGridItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item.userId);

    return (
      <TouchableOpacity onPress={() => handleAvatarPress(item.userId)}>
        <View style={styles.avatarItem}>
          <Avatar
            size={50}
            rounded
            containerStyle={[
              styles.avatar,
              isSelected ? styles.selectedAvatar : { backgroundColor: '#ccc' }
            ]}
            icon={{ name: isSelected ? 'check' : 'user', type: 'font-awesome', color: isSelected ? 'white' : '#808080' }}
            overlayContainerStyle={{ backgroundColor: isSelected ? 'green' : '#ccc' }}
            source={{ uri: item.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
          />
          <Text>{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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

      {selectedUsernames.length > 0 && (
        <View style={styles.selectedUserContainer}>
          {selectedUsernames.map(username => (
            <Text key={username} style={styles.selectedUserText}>{username}</Text>
          ))}
        </View>
      )}

      <SectionList
        sections={sections}
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
    backgroundColor: '#ccc',
  },
  selectedAvatar: {
    backgroundColor: 'green',
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
  selectedUserContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  selectedUserText: {
    backgroundColor: 'forestgreen',
    color: 'white',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
  },
});
