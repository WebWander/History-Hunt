import { Pressable, StyleSheet, Text} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function Button({ children, onPress, style }) {
  return (
    <Pressable
     
      onPress={onPress}
    >
      <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={['#1C3AFA', '#9B3DFD', '#B73FFC']}
              style={StyleSheet.flatten([styles.button, style])}
            >
        <Text>{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF', // Customize the button color
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 30,
    
    
  },
});