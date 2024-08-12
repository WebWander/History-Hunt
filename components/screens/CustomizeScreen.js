import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StatusBar, Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types';

const CustomizeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUri, setImageUri] = useState(null);

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

  const handleContinue = () => {
    if (!title || !duration || !imageUri) {
      alert('Please fill out all fields and select an image.');
      return;
    }

    const huntData = {
      title,
      duration,
      imageUri,
    };

    navigation.navigate('Invite', { huntData });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="flex-row justify-between mb-6">
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={32} color="#0951E2" />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => navigation.navigate('Invite')}>
    <Ionicons name="arrow-forward" size={32} color="#0951E2" />
  </TouchableOpacity>
</View>

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

      <TouchableOpacity className="w-64 self-center" onPress={handleContinue}>
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
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    goForward: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default CustomizeScreen;
