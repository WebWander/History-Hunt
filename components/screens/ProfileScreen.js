import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileImageModal from './UploadPhotoModal';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, collection, query, where, getDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import PropTypes from 'prop-types';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || 'https://example.com/profile.jpg');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeHunts, setActiveHunts] = useState([]);
  const [plannedHunts, setPlannedHunts] = useState([]);
  const [completedHunts, setCompletedHunts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    if (user && user.profileImageUrl) {
      setProfileImage(user.profileImageUrl);
    }
    setupHuntListeners();  // Set up Firestore listeners
  }, [user]);

  const setupHuntListeners = () => {
    if (!user) return;

    const usernamesCache = {};

    const fetchUsername = async (uid) => {
      if (usernamesCache[uid]) return usernamesCache[uid];
      const userDoc = await getDoc(doc(db, 'users', uid));
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
      usernamesCache[uid] = username;
      return username;
    };

    // Listen for changes in planned hunts (hunts the user has created)
    const plannedQuery = query(collection(db, 'hunts'), where('userId', '==', user.uid));
    const plannedUnsubscribe = onSnapshot(plannedQuery, async (snapshot) => {
      const userPlannedHunts = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const huntData = doc.data();
          huntData.huntId = doc.id;
          huntData.creatorName = await fetchUsername(huntData.userId);
          return huntData;
        })
      );
      setPlannedHunts(userPlannedHunts);
    });

    // Listen for changes in active hunts (hunts the user is invited to and hasn't completed)
    const activeQuery = query(
      collection(db, 'hunts'),
      where('friends', 'array-contains', { uid: user.uid, username: user.username })
    );
    const activeUnsubscribe = onSnapshot(activeQuery, async (snapshot) => {
      const userActiveHunts = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const huntData = doc.data();

          // Only include hunts that the user hasn't completed
          if (!huntData.completedBy || !huntData.completedBy.includes(user.uid)) {
            huntData.huntId = doc.id;
            huntData.creatorName = await fetchUsername(huntData.userId);
            return huntData;
          }
        })
      );

      // Filter out any undefined results in case some were skipped
      setActiveHunts(userActiveHunts.filter(hunt => hunt));
    });

    // Listen for changes in completed hunts (hunts the user has completed)
    const completedQuery = query(
      collection(db, 'hunts'),
      where('completedBy', 'array-contains', user.uid)  // Requires a composite index
    );
    const completedUnsubscribe = onSnapshot(completedQuery, async (snapshot) => {
      const userCompletedHunts = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const huntData = doc.data();
          huntData.huntId = doc.id;
          return huntData;
        })
      );
      setCompletedHunts(userCompletedHunts);
      setUsernames(usernamesCache);
    });

    // Unsubscribe from listeners on component unmount
    return () => {
      plannedUnsubscribe();
      activeUnsubscribe();
      completedUnsubscribe();
    };
  };

  const onRefresh = () => {
    setRefreshing(true);
    setupHuntListeners();
    setRefreshing(false);
  };

  const pickImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
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

  const handleHuntPress = (hunt) => {
    navigation.navigate('Hunt', { huntData: { ...hunt, id: hunt.huntId } });
  };

  const renderFriends = (hunt) => {
    const friends = hunt.friends || [];
    const creatorName = hunt.creatorName || 'Unknown'; // Ensure creator's name is included

    // Filter out the current user from the friends list
    const filteredFriends = friends.filter(friend => friend.uid !== user.uid);

    if (filteredFriends.length === 0) return `Soloing it!`;
    if (filteredFriends.length === 1) return `With  ${filteredFriends[0].username}`;
    if (filteredFriends.length === 2) return `With ${creatorName}, ${filteredFriends[0].username}, and ${filteredFriends[1].username}`;
    return `With ${creatorName}, ${filteredFriends.slice(0, -1).map(friend => friend.username).join(', ')}, and ${filteredFriends[filteredFriends.length - 1].username}`;
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 30, paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <TouchableOpacity style={{ position: 'absolute' }} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="orange" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 50, position: 'relative' }}>
          <View style={{ borderColor: '#6A0DAD', borderWidth: 2, borderRadius: 80, overflow: 'hidden', width: 140, height: 140 }}>
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
            <TouchableOpacity key={index} onPress={() => handleHuntPress(hunt)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                <Image
                  source={{ uri: hunt.imageUrl }}
                  style={{ width: 50, height: 50, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 100, padding: 5, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{hunt.title}</Text>
                  <Text style={{ color: 'gray' }}>{renderFriends(hunt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6A0DAD' }}>Planned Hunts:</Text>
          {plannedHunts.map((hunt, index) => (
            <TouchableOpacity key={index} onPress={() => handleHuntPress(hunt)}>
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                <Image
                  source={{ uri: hunt.imageUrl }}
                  style={{ width: 40, height: 40, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 100, padding: 5, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{hunt.title}</Text>
                  <Text style={{ color: 'gray' }}>{renderFriends(hunt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
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
            {completedHunts.map((hunt, index) => (
              <Image
                key={index}
                source={{ uri: hunt.imageUrl }}
                style={{ width: 60, height: 60, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 30, margin: 10 }}
              />
            ))}

            {/* Adding empty medal placeholders */}
            {Array.from({ length: 8 - completedHunts.length }).map((_, index) => (
              <View
                key={`placeholder-${index}`}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#d3d3d3', // Gray color for empty medals
                  borderRadius: 30,
                  margin: 10,
                }}
              />
            ))}
          </View>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProfileScreen;