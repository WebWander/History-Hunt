import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'; 
import Button from '../ui/Button';

const CameraScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  const handleCameraClick = async () => {
    // Request permission to access the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      // Launch the camera
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Set the captured image URI
        setModalVisible(true); // Show the modal with the captured image
      }
    } else {
      alert('Camera permission is required!');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCameraClick} style={{backgroundColor: '#BA49FF', borderRadius: 30, padding: 5, marginBottom: 50 }}>
        <Ionicons name="camera" size={50} color="white"  />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={{ position: 'absolute', top: 15, left: 10 }} onPress={handleCloseModal}>
              <Ionicons name="close" size={30} color="orange" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>NICE!</Text>
            {image && (
              <Image source={{ uri: image }} style={styles.capturedImage} />
            )}
            <Text style={styles.taskText}>You've completed 2/3 tasks</Text>
            <Button style={styles.continueButton} onPress={handleCloseModal}>
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
});

export default CameraScreen;
