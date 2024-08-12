import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

const ConfirmHuntScreen = ({ route, navigation }) => {
  const { huntData } = route.params || { huntData: { title: 'Default Title', duration: '2', markers: [] } };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      {/* Back Button */}
      <TouchableOpacity className="absolute top-12 left-4" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color="#0951E2" />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-4xl font-bold text-center mt-16 mb-4">Confirm Hunt</Text>

      {/* Subtitle */}
      <Text className="text-base text-center text-gray-600">You picked:</Text>
      <Text className="text-2xl font-semibold text-center mb-4">{huntData.title}</Text>

      {/* Route Description */}
      <Text className="text-sm text-center text-purple-600 mb-4">Here is the route you will be taking:</Text>

      {/* Map Displaying the Route */}
      <View className="w-full h-56 mb-6">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: huntData.markers[0]?.latitude || 57.7089,
            longitude: huntData.markers[0]?.longitude || 11.9746,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {huntData.markers.map((marker, index) => (
            <Marker key={index} coordinate={marker} />
          ))}
          {huntData.markers.length > 1 && (
            <Polyline
              coordinates={huntData.markers}
              strokeColor="#FFA500"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>

      {/* Estimated Time */}
      <Text className="text-base text-center text-gray-600">This should take approximately:</Text>
      <Text className="text-2xl font-semibold text-center mb-4">{huntData.duration} hours</Text>

      {/* Confirm Button */}
      <TouchableOpacity
        className="bg-purple-700 rounded-full py-4 items-center mt-6"
        onPress={() => alert('Confirmed!')}
      >
        <Text className="text-lg font-bold text-white">CONFIRM</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

ConfirmHuntScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      huntData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        markers: PropTypes.array.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,


};

export default ConfirmHuntScreen;
