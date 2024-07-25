import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * This is the main component of the React Native application.
 * It renders a view with a user's profile, active hunts, planned hunts, and medals.
 *
 * @returns {JSX.Element} - A React Native component
 */
export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-5 ">
      <TouchableOpacity className="absolute top-1 left-5 z-10">
          <Ionicons name="close" size={28} color="orange" />
        </TouchableOpacity>

        <View className="items-center my-5 mt-10">
          <View className="border-2 border-purple-600 rounded-full p-1">
            <Image
              source={{ uri: 'https://example.com/profile.jpg' }}
              className="w-24 h-24 rounded-full"
            />
          </View>
          <View className="flex-row items-center mt-3">
            <Text className="text-2xl font-bold mr-2">Hermione</Text>
            <TouchableOpacity className="bg-red-400 rounded-full p-1">
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="my-5">
          <Text className="text-lg font-bold text-purple-600 mb-2">Active Hunts:</Text>
          <View className="flex-row items-center py-2 border-b border-gray-300">
            <Image source={{ uri: 'https://example.com/image1.jpg' }} className="w-10 h-10 rounded-full mr-2" />
            <View className="flex-1">
              <Text className="text-base font-bold">Women's Rights in New York City</Text>
              <Text className="text-sm text-gray-500">Soloing it!</Text>
            </View>
          </View>
          <View className="flex-row items-center py-2 border-b border-gray-300">
            <Image source={{ uri: 'https://example.com/image2.jpg' }} className="w-10 h-10 rounded-full mr-2" />
            <View className="flex-1">
              <Text className="text-base font-bold">A Start to LGBTQ Rights Movements</Text>
              <Text className="text-sm text-gray-500">With Ron and Harry</Text>
            </View>
          </View>
        </View>
        
        <View className="my-5">
          <Text className="text-lg font-bold text-purple-600 mb-2">Planned Hunts:</Text>
          <View className="flex-row items-center py-2 border-b border-gray-300">
            <Image source={{ uri: 'https://example.com/image3.jpg' }} className="w-10 h-10 rounded-full mr-2" />
            <View className="flex-1">
              <Text className="text-base font-bold">Gossip Girl Scavenger Hunt</Text>
              <Text className="text-sm text-gray-500">Soloing it!</Text>
            </View>
          </View>
          <Link href="/customize" className="mt-3">
            <Text className="text-red-400 text-base">create hunt</Text>
          </Link>
        </View>
        
        <View className="items-center my-5">
          <Text className="text-lg font-bold text-black mb-2">MEDALS</Text>
          <View className="flex-row flex-wrap justify-around w-full">
            {[...Array(10)].map((_, index) => (
              <View key={index} className="w-12 h-12 bg-gray-300 rounded-full m-2" />
            ))}
          </View>
        </View>
        
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}
