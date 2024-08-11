import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/authContext';
import * as Location from 'expo-location';
import HistoryHuntImage from '../../assets/letter.jpg';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = ({ route, navigation }) => {
  const { huntId } = route.params;
  const {user} = useAuth();
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 57.7089, // Default to Gothenburg coordinates
    longitude: 11.9746,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setRegion({ 
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
  };

  useEffect(() => {
    fetchMarkers();
    getCurrentLocation();
  }, []);

  const fetchMarkers = async () => {
    const huntDoc = await getDoc(doc(db, 'hunts', huntId));
    if (huntDoc.exists()) {
      setMarkers(huntDoc.data().markers);
    }
  };


/*   useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const huntDoc = await getDoc(doc(db, 'hunts', huntId));
        if (huntDoc.exists()) {
          const huntData = huntDoc.data();
          setMarkers(huntData.markers || []); 
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    fetchMarkers();
  }, [huntId]);
 */
  const handleMapPress = (event) => {
    const newMarker = {
      coordinate: event.nativeEvent.coordinate,
      title: `Marker ${markers.length + 1}`
    };
    setMarkers([...markers, newMarker]);
  };

  const handleSaveMarkers = async () => {
    try {
      const huntRef = doc(db, 'hunts', huntId);
      await updateDoc(huntRef, { markers });
      Alert.alert('Success', 'Markers have been saved!');
      navigation.navigate('Profile');
    } catch (error) {
      alert('Error saving markers: ' + error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 relative">
         <TouchableOpacity className="flex-row items-center mb-6" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color="#0951E2" />
      </TouchableOpacity>

      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        onPress={handleMapPress}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} title={marker.title} />
        ))}
      </MapView>

      <View className="absolute bottom-20 left-4">
        <Image
          source={{ uri: user?.profileImageUrl || 'https://example.com/profile.jpg' }}
          className="w-16 h-16 rounded-full border-2 border-white"
        />
      </View>

      <TouchableOpacity
        className="absolute bottom-16 left-40"
        onPress={handleSaveMarkers}
      >
        <View className="flex-column items-center px-4 py-2">
          <Image
            source={HistoryHuntImage}
            className="w-14 h-14 rounded-full border-0.5"
            style={{ borderColor: '#ba55d3', color: '#ba55d3' }}
          />
          <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#ba55d3' }}>
            History<Text style={{ color: '#dda0dd' }}>Hunt</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

MapScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      huntId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default MapScreen;
