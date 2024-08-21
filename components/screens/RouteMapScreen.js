import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Pressable, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/authContext';
import HistoryHuntImage from '../../assets/letter.jpg';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const TARGET_RADIUS = 3000; // Radius in meters

const RouteMapScreen = ({ route, navigation }) => {
  const { huntData } = route.params || { huntData: { title: 'Default Title', markers: [] } };
  const huntId = huntData.id;
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [transportationMode, setTransportationMode] = useState('driving'); 
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);
  const { user } = useAuth();

  const [isCloseToTarget, setIsCloseToTarget] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
        (newLocation) => {
          setLocation(newLocation.coords);
          if (selectedMarker !== null) {
            checkProximity(newLocation.coords, huntData.markers[selectedMarker].coordinate);
          }
        }
      );
    })();
  }, [selectedMarker]);


  

  useEffect(() => {
    if (location && selectedMarker !== null) {
      getDirections(location, huntData.markers[selectedMarker].coordinate, transportationMode);
    }
  }, [transportationMode, selectedMarker, location]);

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5
      });
    }

    return points;
  };

  const getDirections = async (startLoc, destinationLoc, mode = 'driving') => {
    try {
      const apiKey = 'AIzaSyA4rsU2CLdCSerkMXufguIp2B1YadQRrvo';
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&mode=${mode}&key=${apiKey}`;
      const response = await axios.get(url);
  
      if (response.data.routes.length) {
        const route = response.data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(route);
        setRouteCoordinates(decodedPoints);
      }
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };
  
  const getMarkerColor = (index) => {
    if (index === 0) return '#0951E2'; // Blue for the first marker
    if (index === huntData.markers.length - 1) return '#B73FFC'; // Purple for the last marker
    return 'orange'; // All other markers
  };

  const handleMarkerPress = (index) => {
    if (location) {
      getDirections(location, huntData.markers[index].coordinate, transportationMode);
      setSelectedMarker(index);
    }
  };

  
  const getDistance = (loc1, loc2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters

    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const checkProximity = (userLocation, targetLocation) => {
    const distance = getDistance(userLocation, targetLocation);
   /*  if (distance <= TARGET_RADIUS){
        Alert.alert (
            'You have reached your destination!',
            'Now you can press the camera icon to continue'
        )
    } */
    setIsCloseToTarget(distance <= TARGET_RADIUS);
   
    
  };
  

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#BE3CFBcc', '#0951E2cc']}
        start={[0, 0]}
        end={[0, 1]}
        locations={[0, 0.7]}
        className="h-50 justify-center"
      >
        
        <Text className="text-center text-2xl font-extrabold mt-20" style={{ color: "#FF9800" }}>NEXT CLUE</Text>
        <Text className="text-center pt-1 text-white" style={{ fontSize: 16 }}>Make your way to</Text>
        <Text className="text-center pt-1 text-xl font-bold text-white">{huntData.markers[selectedMarker]?.title || "Select a location"}</Text>

        <View className="flex-row justify-around p-4 mt-4">
          <TouchableOpacity onPress={() => setTransportationMode('driving')}>
            <Ionicons name="car" size={32} color={transportationMode === 'driving' ? '#FF9800' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTransportationMode('walking')}>
            <Ionicons name="walk" size={32} color={transportationMode === 'walking' ? '#FF9800' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTransportationMode('bicycling')}>
            <Ionicons name="bicycle" size={32} color={transportationMode === 'bicycling' ? '#FF9800' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTransportationMode('transit')}>
            <Ionicons name="bus" size={32} color={transportationMode === 'transit' ? '#FF9800' : 'white'} />
          </TouchableOpacity>
        </View>

      </LinearGradient>

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
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title || `Spot ${index + 1}`}
            onPress={() => handleMarkerPress(index)}
          >
            <View style={{ backgroundColor: getMarkerColor(index), paddingVertical: 2, paddingHorizontal: 6, borderRadius: 10 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{index + 1}</Text>
            </View>
          </Marker>
        ))}
        {routeCoordinates.length > 0 && (
          <Polyline
          coordinates={routeCoordinates/* .length > 0 ? routeCoordinates : huntData.markers.map(marker => marker.coordinate) */}
          strokeColor="orange" 
          strokeWidth={4}
          />
        )}
      </MapView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center bg-black/50">
            <View className="rounded-3xl p-4 mb-60 mx-12 shadow-lg" style={{ backgroundColor: '#282D41' }}>
              <Text className="text-center mt-2" style={{ fontSize: 18, color: 'rgba(238, 238, 238, 0.8)' }}>After you begin a hunt, you can choose your transportation method to travel to the next clue.</Text>
              <Text className="text-center font-bold mb-2 mt-2" style={{ fontSize: 18, color: 'rgba(238, 238, 238, 0.8)' }}>Tap anywhere to continue.</Text>
            </View>
          </View>
        </Pressable>
      </Modal>

      <View className="absolute bottom-16 left-4">
        <Image
          source={{ uri: user?.profileImageUrl || 'https://example.com/default-avatar.jpg' }}
          className="w-16 h-16 rounded-full border-2 border-white"
        />
      </View>

      <TouchableOpacity
  className="absolute bottom-14 right-36"
  onPress={() => {
    if (selectedMarker !== null) {
        navigation.navigate('Camera', { huntData: { ...huntData, id: huntData.huntId }, currentIndex: selectedMarker });


    } else {
      Alert.alert('No marker selected', 'Please select a marker first.');
    }
  }}
>
  <View className="flex-column items-center px-4 py-2">
    {isCloseToTarget ? (
      <Ionicons name="camera" size={50} color="black" />
    ) : (
      <Image
        source={HistoryHuntImage}
        className="w-16 h-16 rounded-full border-0.5"
        style={{ borderColor: '#ba55d3', color: '#ba55d3' }}
      />
    )}
  </View>
</TouchableOpacity>


    </View>
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
            title: PropTypes.string, // Ensure the title prop is accounted for
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
