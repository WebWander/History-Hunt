import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function Button({ children, onPress }) {
  return (
    <Pressable
     
      onPress={onPress}
    >
      <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={['#1C3AFA', '#9B3DFD', '#B73FFC']}
              style={styles.button}
            >
        <Text style={styles.buttonText}>{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 120,
    left: 60, 
    right: 60, 
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});

