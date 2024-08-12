import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileImageModal from './UploadPhotoModal';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';

const ProfileScreen = ({ navigation }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [profileImage, setProfileImage] = useState(authUser?.profileImageUrl || 'https://example.com/profile.jpg');
  const [modalVisible, setModalVisible] = useState(false);
  const [hunts, setHunts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('ProfileScreen useEffect - authUser:', authUser);
    if (authUser) {
      setUser(authUser);
      if (authUser.profileImageUrl) {
        setProfileImage(authUser.profileImageUrl);
      }
      fetchHunts();
    }
  }, [authUser]);

  const fetchHunts = async () => {
    if (!user) return;
    const q = query(collection(db, 'hunts'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const userHunts = querySnapshot.docs.map(doc => doc.data());
    setHunts(userHunts);
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
    await updateDoc(userRef, { 
      profileImageUrl: downloadURL || "",
      pushToken: authUser.pushToken || ""

    });
    console.log('Profile image URL updated');
  };
  const handlePress = () => {
    setModalVisible(true);
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity style={{ position: 'absolute', top: 10, left: 10 }} onPress={() => console.log('Close')}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
            <Image source={{ uri: 'https://example.com/image1.jpg' }} style={{ width: 40, height: 40, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 100, padding: 5, marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Women's Rights in New York City</Text>
              <Text style={{ color: 'gray' }}>Soloing it!</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
            <Image source={{ uri: 'https://example.com/image2.jpg' }} style={{ width: 40, height: 40, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 100, padding: 5, marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>A Start to LGBTQ Rights Movements</Text>
              <Text style={{ color: 'gray' }}>With Ron and Harry</Text>
            </View>
          </View>
        </View>

        <View style={{ marginVertical: 0 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6A0DAD' }}>Planned Hunts:</Text>
          {hunts.map((hunt, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
              <Image source={{ uri: hunt.imageUrl }} style={{ width: 40, height: 40, borderColor: '#6A0DAD', borderWidth: 0.5, borderRadius: 100, padding: 5, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{hunt.title}</Text>
                <Text style={{ color: 'gray' }}> With: {hunt.friends.join(',')}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate('Customize')}>
            <Text style={{ marginTop: 20, color: '#FF6347', fontSize: 16 }}>Create Hunt</Text>
          </TouchableOpacity>
        </View>

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

export default ProfileScreen;
