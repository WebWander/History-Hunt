import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
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

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter(u => u.uid !== user.uid));
      Alert.alert('Friend Removed', `${user.username} has been removed from the invite list.`);
    } else {
      setSelectedUsers([...selectedUsers, user]);
      Alert.alert('Friend Added', `${user.username} has been added to the invite list.`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
       <View className="flex-row justify-between mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color="#0951E2" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
        <Ionicons name="arrow-forward" size={32} color="#0951E2" />
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 40, fontWeight: '600', textAlign: 'center', marginBottom: 8 }}>Invite Friends</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginHorizontal: 20, marginBottom: 20 }}>
        <Ionicons name="search" size={20} color="gray" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, height: 40 }}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1 / 3,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
            }}
            onPress={() => handleUserSelect(item)}
          >
            {item.profileImageUrl ? (
              <Image source={{ uri: item.profileImageUrl }} style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 5, borderWidth: selectedUsers.includes(item) ? 2 : 0, borderColor: 'green' }} />
            ) : (
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderWidth: selectedUsers.includes(item) ? 2 : 0, borderColor: 'green' }}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            )}
            <Text style={{ textAlign: 'center' }}>{item.username}</Text>
          </TouchableOpacity>
        )}
        numColumns={3}
      />

      <TouchableOpacity style={{ width: 256, alignSelf: 'center', marginVertical: 20 }} onPress={handleInvite}>
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
