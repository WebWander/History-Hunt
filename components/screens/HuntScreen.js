import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

const ConfirmHuntScreen = ({ route, navigation }) => {
  const { huntData } = route.params || { huntData: { title: 'Default Title', duration: '2', markers: [] } };

 
  const validMarkers = huntData.markers && huntData.markers.length > 0 ? huntData.markers : [];

  const getMarkerColor = (index) => {
    if (index === 0) return '#0951E2'; // First marker
    if (index === validMarkers.length - 1) return '#B73FFC'; // Last marker
    return 'orange'; // All other markers
  };

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
            latitude: validMarkers[0]?.coordinate?.latitude || 57.7089,
            longitude: validMarkers[0]?.coordinate?.longitude || 11.9746,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {validMarkers.map((marker, index) => (
            <Marker key={index} coordinate={marker.coordinate} title={`Spot ${index + 1}`}>
            <View style={{ backgroundColor: getMarkerColor(index), paddingVertical: 2, paddingHorizontal:6, borderRadius: 10 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{index + 1}</Text>
            </View>
          </Marker>
          ))}
          {validMarkers.length > 1 && (
            <Polyline
              coordinates={validMarkers.map(marker => marker.coordinate)}
              strokeColor="#FFA500"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>

      {/* Estimated Time */}
      <Text className="text-base text-center text-gray-600">This should take approximately:</Text>
      <Text className="text-2xl font-semibold text-center mb-4">{huntData.duration}</Text>

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
        markers: PropTypes.arrayOf(
          PropTypes.shape({
            coordinate: PropTypes.shape({
              latitude: PropTypes.number.isRequired,
              longitude: PropTypes.number.isRequired,
            }).isRequired,
          })
        ).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default ConfirmHuntScreen;
