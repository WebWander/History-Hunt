import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';

const RouteMapScreen = ({ route, navigation }) => {
  const { huntData } = route.params || { huntData: { title: 'Default Title', markers: [] } };
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const getMarkerColor = (index) => {
    if (index === 0) return '#0951E2'; // Blue for the first marker
    if (index === huntData.markers.length - 1) return '#B73FFC'; // Purple for the last marker
    return 'orange'; // All other markers
  };

  return (
    <SafeAreaView className="flex-1">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location?.latitude || 57.7089,
          longitude: location?.longitude || 11.9746,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {huntData.markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} title={index === 0 || index === huntData.markers.length - 1 ? `Spot ${index + 1}` : null}>
            <View style={{ backgroundColor: getMarkerColor(index), paddingVertical: 2, paddingHorizontal: 6, borderRadius: 10 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{index + 1}</Text>
            </View>
          </Marker>
        ))}
        {huntData.markers.length > 1 && (
          <Polyline
            coordinates={huntData.markers.map(marker => marker.coordinate)}
            strokeColor="#FFA500"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Pop-up modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-black-200 rounded-lg p-6 mx-10 shadow-lg">
            <Text className="text-lg text-center font-bold mb-4">Next Clue</Text>
            <Text className="text-center mb-6">Make your way to {huntData.markers[0]?.title || "the next location"}.</Text>
            <Text className="text-center mb-6">After you begin a hunt, you can choose your transportation method to travel to the next clue. Tap anywhere to continue.</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} className="absolute top-2 right-2">
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity className="absolute top-12 left-4" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color="#0951E2" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

RouteMapScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      huntData: PropTypes.shape({
        title: PropTypes.string.isRequired,
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

export default RouteMapScreen;
