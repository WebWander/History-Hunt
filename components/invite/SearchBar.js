import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can use any icon library

const SearchInput = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="#aaa"
      />
      <Icon name="search" size={20} color="#aaa" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
<<<<<<< HEAD
    borderRadius:5,
=======
>>>>>>> 4e54c53fe50d2b158ea9d69c4249241f6b25cf37
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'transparent',
    marginLeft : 50,
    marginRight : 50,
<<<<<<< HEAD
    marginVertical: 20
=======
>>>>>>> 4e54c53fe50d2b158ea9d69c4249241f6b25cf37
  },
  input: {
    flex: 1,
    paddingLeft: 5,
  },
  icon: {
    marginLeft: 10,
  },
});

<<<<<<< HEAD
export default SearchInput;
=======
export default SearchInput;
>>>>>>> 4e54c53fe50d2b158ea9d69c4249241f6b25cf37
