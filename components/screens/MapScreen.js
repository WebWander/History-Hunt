import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
/* import { SafeAreaView } from 'react-native-safe-area-context'; */
import { db, auth } from '../../firebaseConfig';
import {  addDoc, collection } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/authContext';
import * as Location from 'expo-location';
import HistoryHuntImage from '../../assets/letter.jpg';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
/* import { customMapStyle } from '../ui/mapStyle'; */

const MapScreen = ({ route, navigation }) => {
  const { huntData } = route.params || { huntData: { title: 'Default Title', friends: [], markers: [] } };
  const { user } = useAuth();
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
    getCurrentLocation();
  }, []);

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    
    try {
      // Use Expo's reverse geocode to get the place name
      const geocodedLocation = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
  
      let placeName = 'Unknown place';
      if (geocodedLocation.length > 0) {
        const firstResult = geocodedLocation[0];
        placeName = firstResult.name || firstResult.street || firstResult.city || 'Unknown place';
      }
  
      const newMarker = {
        coordinate,
        title: placeName,  
      };
      
      setMarkers([...markers, newMarker]);
  
    } catch (error) {
      console.error('Error getting place name:', error);
    }
  };
  

  const handleSaveMarkers = async () => {
    if (markers.length === 0) {
      Alert.alert('Error', 'Please add at least one marker.');
      return;
    }

    try {
      const response = await fetch(huntData.imageUri);
      const blob = await response.blob();
      const storage = getStorage();
      const refPath = ref(storage, `hunt_images/${auth.currentUser.uid}_${Date.now()}.jpg`);
      await uploadBytes(refPath, blob);
      const downloadURL = await getDownloadURL(refPath);

      // Save hunt data with image URL and friends array
      const huntDocRef = await addDoc(collection(db, 'hunts'), {
        ...huntData,
        imageUrl: downloadURL, 
        userId: auth.currentUser.uid,
        markers: markers,
        friends: huntData.friends,
      });

      const huntId = huntDocRef.id;

      Alert.alert('Success', 'Hunt has been saved!');
      navigation.navigate('Profile', { huntData: { ...huntData, id: huntId } } );

    } catch (error) {
      alert('Error saving hunt: ' + error.message);
    }
  };

  return (
    <View className="flex-1">
    
      <MapView
        style={{ flex: 1 }}
        mapType='standard'
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        onPress={handleMapPress}
      >
        {markers.map((marker, index) => (
           <Marker key={index} coordinate={marker.coordinate}>
           <View style={{ backgroundColor: 'orange', padding: 5, borderRadius: 10 }}>
             <Text style={{ color: 'black', fontWeight: 'bold' }}>{index + 1}</Text>
           </View>
          </Marker>
        ))}
         {markers.length > 1 && (
          <Polyline
            coordinates={markers.map(marker => marker.coordinate)}
            strokeColor="#FFA500" 
            strokeWidth={4}
          />
        )}
      </MapView>

      <TouchableOpacity className="absolute top-12 left-4" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color="#0951E2" />
      </TouchableOpacity>

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
    </View>
  );
};

MapScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      huntData: PropTypes.object.isRequired, 
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default MapScreen;
