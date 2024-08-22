import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, TextInput, Image, Alert, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';

const InviteFriends = ({ route, navigation }) => {
  const { huntData } = route.params || { huntData: { title: 'Default Title', friends: [], markers: [] } };
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchRegisteredUsers();
  }, []);

  const fetchRegisteredUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    setUsers(usersList);
    setFilteredUsers(usersList);
  };

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(user =>
          user.username?.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

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
      .filter(user => selectedUsers.includes(user))
      .map(user => user.username);

    return {
      selectedUsernames,
      sections: Object.values(sections).sort((a, b) => a.title.localeCompare(b.title))
    };
  };

  const { selectedUsernames, sections } = organizeUsers(filteredUsers, selectedUsers);

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(user)) {
        return prevSelectedUsers.filter(u => u.uid !== user.uid);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const handleInvite = () => {
    try {
      const friends = selectedUsers.map(user => ({
        uid: user.uid,
        username: user.username,
      }));
      const updatedHuntData = { ...huntData, friends };
      Alert.alert('Success', 'Friends have been invited!');
      navigation.navigate('Map', { huntData: updatedHuntData });
    } catch (error) {
      alert('Error inviting friends: ' + error.message);
    }
  };

  const renderGridItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item);

    return (
      <TouchableOpacity onPress={() => handleUserSelect(item)}>
        <View style={[styles.avatarItem, isSelected && styles.selectedAvatarItem]}>
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={60} color="green" />
          ) : (
            <Image
              source={{ uri: item.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
              style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 5 }}
            />
          )}
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
        keyExtractor={(item) => item.uid}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#0951E2" />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 40, fontWeight: '600', textAlign: 'center', marginBottom: 8 }}>Invite Friends</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.uid + index}
        renderItem={({ item }) => null}
        renderSectionHeader={renderSection}
        contentContainerStyle={styles.sectionListContent}
      />

      <TouchableOpacity style={{ width: 256, alignSelf: 'center', marginVertical: 20, position:'absolute', bottom: 30 }} onPress={handleInvite}>
        <LinearGradient
          colors={['#0951E2', '#BE3CFB']}
          style={{ borderRadius: 50, paddingVertical: 12, alignItems: 'center' }}
          start={[0, 0]}
          end={[1, 0]}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>INVITE</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

InviteFriends.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      huntData: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default InviteFriends;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  avatarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 100,
    marginBottom: 20,
    marginRight: 10,
    backgroundColor: '#F3F3F3',
    borderRadius: 35,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarItem: {
    backgroundColor: '#F3F3F3',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '500',
    backgroundColor: 'white',
    paddingHorizontal: 15,
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