import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileImageModal = ({ visible, onClose, onPickImage, onTakePhoto }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-72 p-5 bg-white rounded-xl">
              <TouchableOpacity 
                className="absolute right-10 top-1 p-3"
                onPress={onClose}
              >
                <Ionicons name="close" size={30} color="rgba(255,165,0, 0.7)" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center mb-4 mt-10" onPress={onPickImage}>
                <Ionicons name="image" size={30} color="rgba(255,165,0, 0.7)" />
                <Text className="ml-2 text-base">Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center mb-4" onPress={onTakePhoto}>
                <Ionicons name="camera" size={30} color="rgba(255,165,0, 0.7)" />
                <Text className="ml-2 text-base">Take a Photo</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ProfileImageModal;
