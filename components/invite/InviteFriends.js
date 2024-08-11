import React, { useState, useEffect } from 'react';
import { Text, FlatList, TouchableOpacity, Alert, Image, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
/* import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore'; */
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';

const InviteFriends = ({ route, navigation }) => {
  const { huntData } = route.params;
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.ImageAvailable, Contacts.Fields.Image]
        });

        if (data.length > 0) {
          setContacts(data);
          setFilteredContacts(data);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredContacts(
        contacts.filter(contact =>
          (contact.name && contact.name.toLowerCase().includes(query)) ||
          (contact.phoneNumbers && contact.phoneNumbers.some(number => number.number.includes(query)))
        )
      );
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const toggleSelectContact = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter(item => item.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleInvite = async () => {
    try {
      const friends = selectedContacts.map(contact => contact.name);
    
      const updatedHuntData = { ...huntData, friends };
        
      Alert.alert('Success', 'Friends have been invited!');
      navigation.navigate('Map', { huntData: updatedHuntData });
      
    } catch (error) {
      alert('Error inviting friends: ' + error.message);
    }
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flex: 1 / 3,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
      }}
      onPress={() => toggleSelectContact(item)}
    >
      {item.imageAvailable && item.image ? (
        <Image source={{ uri: item.image.uri }} style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 5, borderWidth: selectedContacts.includes(item) ? 2 : 0, borderColor: 'green' }} />
      ) : (
        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderWidth: selectedContacts.includes(item) ? 2 : 0, borderColor: 'green' }}>
          <Ionicons name="person" size={30} color="#fff" />
        </View>
      )}
      <Text style={{ textAlign: 'center' }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity className="flex-row items-center mb-6" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color="#0951E2" />
      </TouchableOpacity>


      <Text style={{ fontSize: 40, fontWeight: '600', textAlign: 'center', marginBottom: 8 }}>Invite Friends</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginHorizontal: 20, marginBottom: 20 }}>
        <Ionicons name="search" size={20} color="gray" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, height: 40 }}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
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
      huntData: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default InviteFriends;
