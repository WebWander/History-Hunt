import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import PropTypes from 'prop-types';

const CustomizeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [huntId, setHuntId] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveHunt = async () => {
    if (!title || !duration || !imageUri) {
      alert('Please fill out all fields and select an image.');
      return;
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storage = getStorage();
      const refPath = ref(storage, `hunt_images/${auth.currentUser.uid}_${Date.now()}.jpg`);
      await uploadBytes(refPath, blob);
      const downloadURL = await getDownloadURL(refPath);

      const docRef = await addDoc(collection(db, 'hunts'), {
        title,
        duration,
        imageUrl: downloadURL,
        userId: auth.currentUser.uid,
        friends: []
      });

      setHuntId(docRef.id);
      navigation.navigate('Invite', { huntId: docRef.id });

    } catch (error) {
      alert('Error saving hunt: ' + error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <TouchableOpacity className="flex-row items-center mb-6" onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="arrow-back" size={32} color="#0951E2" />
      </TouchableOpacity>

      <Text className="text-5xl font-semibold text-black text-center mb-8">Customize</Text>

      <Text className="text-base text-purple-soft text-center font-semibold mb-2">How long should it be?</Text>
      <TextInput
        className="h-12 w-80 mx-auto border border-gray-300 rounded px-3 mb-6"
        placeholder="3 hours? 2 days? You pick."
        placeholderTextColor="#B0B0B0"
        value={duration}
        onChangeText={setDuration}
      />

      <Text className="text-base text-purple-soft text-center font-semibold mb-2">What do you want to call your hunt?</Text>
      <TextInput
        className="h-12 w-80 mx-auto border border-gray-300 rounded px-3 mb-8"
        placeholder="Name"
        placeholderTextColor="#B0B0B0"
        value={title}
        onChangeText={setTitle}
      />

      <Text className="text-base text-purple-bright text-center mb-4">Insert Image</Text>
      <TouchableOpacity className="w-28 h-28 rounded-full border border-black justify-center items-center self-center mb-16" onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', borderRadius: 100 }} />
        ) : (
          <Ionicons name="add" size={55} color="black" />
        )}
      </TouchableOpacity>

      <TouchableOpacity className="w-64 self-center" onPress={saveHunt}>
        <LinearGradient
          colors={['#0951E2', '#BE3CFB']}
          className="rounded-full py-4 items-center"
          start={[0, 0]}
          end={[1, 0]}
        >
          <Text className="text-lg font-bold text-white">CONTINUE</Text>
        </LinearGradient>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};


CustomizeScreen.propTypes = {
   
      huntId: PropTypes.string.isRequired,
   
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default CustomizeScreen;
