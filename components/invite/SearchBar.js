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
    borderRadius:5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'transparent',
    marginLeft : 50,
    marginRight : 50,
    marginVertical: 20
  },
  input: {
    flex: 1,
    paddingLeft: 5,
  },
  icon: {
    marginLeft: 10,
  },
});

export default SearchInput;