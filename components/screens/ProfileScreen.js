

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileImageModal from './UploadPhotoModal';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
/* import RefreshControlComponent from '../Loading'; */
import PropTypes  from 'prop-types';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || 'https://example.com/profile.jpg');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeHunts, setActiveHunts] = useState([]);
  const [plannedHunts, setPlannedHunts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [usernames, setUsernames] = useState({}); 

  useEffect(() => {
    if (user && user.profileImageUrl) {
      setProfileImage(user.profileImageUrl);
    }
    fetchHunts();
  }, [user]);

  const fetchHunts = async () => {
    if (!user) return;

    const usernamesCache = {};

    const fetchUsername = async (uid) => {
      if (usernamesCache[uid]) return usernamesCache[uid];
      const userDoc = await getDoc(doc(db, 'users', uid));
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
      usernamesCache[uid] = username;
      return username;
    };

    // Fetch hunts where the user is the creator
    const plannedQuery = query(collection(db, 'hunts'), where('userId', '==', user.uid));
    const plannedSnapshot = await getDocs(plannedQuery);
    const userPlannedHunts = await Promise.all(
      plannedSnapshot.docs.map(async (doc) => {
        const huntData = doc.data();
        huntData.creatorName = await fetchUsername(huntData.userId);
        return huntData;
      })
    );
    setPlannedHunts(userPlannedHunts);

    // Fetch hunts where the user is invited
    const activeQuery = query(collection(db, 'hunts'), where('friends', 'array-contains', { uid: user.uid, username: user.username }));
    const activeSnapshot = await getDocs(activeQuery);
    const userActiveHunts = await Promise.all(
      activeSnapshot.docs.map(async (doc) => {
        const huntData = doc.data();
        huntData.creatorName = await fetchUsername(huntData.userId);
        return huntData;
      })
    );
    setActiveHunts(userActiveHunts);
    setUsernames(usernamesCache);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHunts().then(() => setRefreshing(false));
  };


  const pickImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert('Error uploading image:' + error.message);
    }
    setModalVisible(false);
  };

  const takePhoto = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert('Error uploading image:' + error.message);
    }
    setModalVisible(false);
  };

  const saveImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const refPath = ref(storage, `profile_images/${auth.currentUser.uid}.jpg`);
      await uploadBytes(refPath, blob);
      const downloadURL = await getDownloadURL(refPath);
      setProfileImage(downloadURL);
      await updateProfileImage(downloadURL);
    } catch (error) {
      alert('Error saving image: ' + error.message);
    }
    setModalVisible(false);
  };

  const updateProfileImage = async (downloadURL) => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, { profileImageUrl: downloadURL });
    console.log('Profile image URL updated');
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const renderFriends = (friends) => {
    if (friends.length === 0) return 'Soloing it!';
    if (friends.length === 1) return `With ${friends[0].username}`;
    if (friends.length === 2) return `With ${friends[0].username} and ${friends[1].username}`;
    return `With ${friends.slice(0, -1).map(friend => friend.username).join(', ')} and ${friends[friends.length - 1].username}`;
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity style={{ position: 'absolute', top: 10, left: 10 }} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="orange" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 50, position: 'relative' }}>
          <View style={{ borderColor: '#6A0DAD', borderWidth: 2, borderRadius: 60, overflow: 'hidden', width: 120, height: 120 }}>
            <Image
              source={{ uri: profileImage }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 130,
              bottom: 0,
              backgroundColor: '#FF6347',
              borderRadius: 15,
              padding: 5,
            }}
            onPress={handlePress}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{user?.username || 'Username'}</Text>
        </View>
        <ProfileImageModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onPickImage={pickImage}
          onTakePhoto={takePhoto}
        />

        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6A0DAD' }}>Active Hunts:</Text>
          {activeHunts.map((hunt, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
              <Image
                source={{ uri: hunt.imageUrl }}
                style={{ width: 40, height: 40, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 100, padding: 5, marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{hunt.title}</Text>
                <Text style={{ color: 'gray' }}>{renderFriends(hunt.friends)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6A0DAD' }}>Planned Hunts:</Text>
          {plannedHunts.map((hunt, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
              <Image
                source={{ uri: hunt.imageUrl }}
                style={{ width: 40, height: 40, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 100, padding: 5, marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{hunt.title}</Text>
                <Text style={{ color: 'gray' }}>{renderFriends(hunt.friends)}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Customize')}>
          <Text style={{ marginTop: 20, color: '#FF6347', fontSize: 16 }}>Create Hunt</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ddd', marginHorizontal: 20 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>MEDALS</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ddd', marginHorizontal: 20 }} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', width: '100%', marginVertical: 20 }}>
            {[...Array(10)].map((_, index) => (
              <View key={index} style={{ width: 50, height: 50, backgroundColor: '#ccc', borderRadius: 25, margin: 10 }} />
            ))}
          </View>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

ProfileScreen.propTypes = {
 /*  route: PropTypes.shape({
    params: PropTypes.shape({ */
     /*  huntId: PropTypes.string.isRequired, */
   /*  }).isRequired, */
/*   }).isRequired, */
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProfileScreen;
