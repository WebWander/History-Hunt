import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Button from '../ui/Button';
import { Image } from 'react-native-elements';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { auth, db } from '../../firebaseConfig';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

const CameraScreen = ({ route, navigation }) => {
  const { huntData, currentIndex } = route.params;
  const huntId = huntData.id;
  const [initialModalVisible, setInitialModalVisible] = useState(true);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access camera was denied');
        return;
      }
    })();
  }, []);


  // I dont know, trying something

  useEffect(() => {
    setImage(null); // Reset the image on component mount
    setInitialModalVisible(true); // Show the initial modal
    setCameraModalVisible(false); // Ensure the camera modal is not visible initially
  }, []);

  // This useEffect cleans up the state when the component is unmounted
  useEffect(() => {
    return () => {
      setImage(null); // Clear the image state when the component unmounts
      setCameraModalVisible(false); 
    };
  }, []);


  const handleCameraClick = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Lower the quality to reduce memory usage
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setCameraModalVisible(true);
  
        const photoProof = await uploadPhoto(result.assets[0].uri);
  
        if (photoProof) {
          await savePhotoProof(huntId, currentIndex, photoProof);
        }
      }
    } else {
      alert('Camera permission is required!');
    }
  };
  
  const uploadPhoto = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Uploading to Firebase Storage
      const storage = getStorage();
      const photoRef = ref(storage, `photo_proofs/${auth.currentUser.uid}_${Date.now()}.jpg`);
      await uploadBytes(photoRef, blob);
      
      // Release the blob immediately after upload
      blob.close();
  
      const downloadURL = await getDownloadURL(photoRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading photo: ", error);
      Alert.alert('Error', 'Failed to upload photo proof');
      return null;
    }
  };
  
  

  const savePhotoProof = async (huntId, markerIndex, photoProof) => {
    try {
      await addDoc(collection(db, 'photoProofs'), {
        huntId,
        markerIndex,
        userId: auth.currentUser.uid,
        photoUrl: photoProof,
        timestamp: new Date(),
      });
      console.log('Photo proof saved successfully.');
    } catch (error) {
      console.error("Error saving photo proof: ", error);
      Alert.alert('Error', 'Failed to save photo proof');
    }
  };

  const handleCloseInitialModal = () => {
    setInitialModalVisible(false);
    
  };

  const markHuntAsCompleted = async (huntId) => {
    try {
      const huntRef = doc(db, 'hunts', huntId);
      await updateDoc(huntRef, { completed: true });
      console.log('Hunt marked as completed');
    } catch (error) {
      console.error('Error marking hunt as completed: ', error);
      Alert.alert('Error', 'Failed to mark hunt as completed');
    }
  };
  

  const handleCloseCameraModal = async () => {
    setCameraModalVisible(false);
  
    if (currentIndex < huntData.markers.length - 1) {
      // Navigate to the next location
      navigation.navigate('Route', { huntData });
    } else {
      // Mark the hunt as completed and navigate to the Profile screen
      try {
        await markHuntAsCompleted(huntData.id);
        alert('Congratulations! You have completed the hunt.');
        navigation.navigate('Profile');
      } catch (error) {
        console.error('Error completing the hunt:', error);
        alert('An error occurred while completing the hunt. Please try again.');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleCameraClick}
        style={{ backgroundColor: '#BA49FF', borderRadius: 30, padding: 5, marginBottom: 50 }}
      >
        <Ionicons name="camera" size={50} color="white" />
      </TouchableOpacity>

      {/* Initial Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={initialModalVisible}
        onRequestClose={handleCloseInitialModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={{ position: 'absolute', top: 15, left: 10 }} onPress={handleCloseInitialModal}>
              <Ionicons name="close" size={30} color="orange" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>TAKE A PHOTO</Text>
            <Text style={styles.clueText}>{huntData.markers[currentIndex].title}</Text>
            <Button style={styles.closeButton} onPress={handleCloseInitialModal}>
              <Text style={styles.closeButtonText}>OK, I'M HERE</Text>
            </Button>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cameraModalVisible}
        onRequestClose={handleCloseCameraModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={{ position: 'absolute', top: 15, left: 10 }} onPress={handleCloseCameraModal}>
              <Ionicons name="close" size={30} color="orange" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>NICE!</Text>
            {image && <Image source={{ uri: image }} style={styles.capturedImage} />}
            <Text style={styles.taskText}>
              You've completed {currentIndex + 1}/{huntData.markers.length} tasks
            </Text>
            <Button style={styles.continueButton} onPress={handleCloseCameraModal}>
              <Text style={styles.continueButtonText}>CONTINUE</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#dcdcdc',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 15,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
    color: '#007AFF',
  },
  capturedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 10,
  },
  continueButton: {
    marginTop: 18,
    width: 200,
    backgroundColor: '#6A1B9A',
    borderRadius: 30,
    padding: 10,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
  closeButton: {
    marginTop: 18,
    width: 200,
    backgroundColor: '#FF9800',
    borderRadius: 30,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default CameraScreen;
