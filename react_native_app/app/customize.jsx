import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

/**
 * This is the main component of the React Native application.
 * It renders a view with customization options for a hunt.
 *
 * @returns {JSX.Element} - A React Native component
 */
export default function CustomizeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-6 "> 

      {/* The header contains a back button. */}
        <Link href="/profile" className="flex-row items-center mb-6"> {/* // TODO change index to profile when done with authentication */}
        <Ionicons name="arrow-back" size={32} color="#0951E2" t/>
      </Link>
      
      {/* The title of the screen. */}
      <Text className="text-5xl font-semibold text-black text-center mb-8">Customize</Text>
      
      {/* The form asks how long the hunt should be. */}
      <Text className="text-base text-purple-soft text-center font-semibold mb-2">How long should it be?</Text>
      <TextInput
        className="h-12 w-80 mx-auto border border-gray-300 rounded px-3 mb-6"
        placeholder="3 hours? 2 days? You pick."
        placeholderTextColor="#B0B0B0"
      />
      
      {/* The form asks what to call the hunt. */}
      <Text className="text-base text-purple-soft text-center font-semibold mb-2">What do you want to call your hunt?</Text>
      <TextInput
        className="h-12 w-80 mx-auto border border-gray-300 rounded px-3 mb-8"
        placeholder="Name"
        placeholderTextColor="#B0B0B0"
      />
      
      {/* The form can upload an image. */}
      <Text className="text-base text-purple-bright text-center mb-4">insert image</Text>
      <TouchableOpacity className="w-28 h-28 rounded-full border border-black justify-center items-center self-center mb-16">
        <Ionicons name="add" size={55} color="black" />
      </TouchableOpacity>
      
      {/* The continue button. */}
      <TouchableOpacity className="w-64 self-center">
        <LinearGradient
          colors={['#0951E2', '#BE3CFB']}
          className="rounded-full py-4 items-center"
          start={[0, 0]}
          end={[1, 0]}
        >
          <Text className="text-lg font-bold text-white">CONTINUE</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* The status bar. */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
