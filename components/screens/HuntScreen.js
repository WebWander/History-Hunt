import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

const ConfirmHuntScreen = ({ route, navigation }) => {
  const { huntData } = route.params || { huntData: { title: 'Default Title', duration: '2', markers: [] } };

  const validMarkers = huntData.markers && huntData.markers.length > 0 ? huntData.markers : [];

  const getMarkerColor = (index) => {
    if (index === 0) return '#0951E2'; 
    if (index === validMarkers.length - 1) return '#B73FFC'; 
    return 'orange'; 
  };

  const renderMarkerList = () => {
    return huntData.markers.map((marker, index) => {
      if (index === 0 || index === huntData.markers.length - 1) {
        const color = getMarkerColor(index);
        const title = marker.title || `Spot ${index + 1}`;
        return (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <View style={{ width: 10, height: 10, backgroundColor: color, borderRadius: 5, marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: '#333' }}>{title}</Text>
          </View>
        );
      }

     
      return (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 4, marginLeft: 1.5 }}>
          <View style={{ width: 6, height: 6, backgroundColor: '#FFA500', borderRadius: 3, marginRight: 8 }} />
        </View>
      );
    });
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
      <Text className="text-base text-center text-purple-600">You picked:</Text>
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
            <Marker key={index} coordinate={marker.coordinate} title={marker.title || `Spot ${index + 1}`}>
              <View style={{ backgroundColor: getMarkerColor(index), paddingVertical: 2, paddingHorizontal: 6, borderRadius: 10 }}>
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

      {/* Marker List */}
      <View className="mb-4">
        {renderMarkerList()}
      </View>

      {/* Estimated Time */}
      <Text className="text-base text-center text-purple-600">This should take approximately:</Text>
      <Text className="text-2xl font-semibold text-center mb-4">{huntData.duration}</Text>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('RouteMap', { huntData })}>
        <LinearGradient
          colors={['#0951E2', '#BE3CFB']}
          style={styles.gradientButton}
          start={[0, 0]}
          end={[1, 0]}
        >
          <Text style={styles.confirmButtonText}>CONFIRM</Text>
        </LinearGradient>
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
            title: PropTypes.string, // Add title to PropTypes
          })
        ).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#BE3CFB',
  },
  huntTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  routeDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#BE3CFB',
    marginBottom: 16,
  },
  mapContainer: {
    width: '100%',
    height: 224,
    marginBottom: 24,
  },
  markerListContainer: {
    marginBottom: 16,
  },
  mainMarkerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  intermediateMarkerContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    marginLeft: 3,
  },
  markerDot: {
    borderRadius: 5,
    marginRight: 8,
  },
  markerTitle: {
    fontSize: 16,
    color: '#333',
  },
  markerLabel: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  estimatedTimeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#BE3CFB',
  },
  estimatedTime: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    width: 256,
    alignSelf: 'center',
  },
  gradientButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});


export default ConfirmHuntScreen;