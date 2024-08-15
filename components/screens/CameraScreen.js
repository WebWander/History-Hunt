import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Button from '../ui/Button';

const CameraScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const handleCameraClick = () => {
    setModalVisible(true); 
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
            <Text style={styles.modalTitle}>TAKE A PHOTO</Text>
            <Text style={styles.clueText}>Walk to this area to where the Grande Harvest Wine shop is located next to Track 17.</Text>
            <Button style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>OK, I'M HERE</Text>
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
    width: 320,
    padding: 15,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 20,
    color: '#007AFF',
  },
  clueText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 18,
    width: 200,
    backgroundColor: '#007AFF',
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
