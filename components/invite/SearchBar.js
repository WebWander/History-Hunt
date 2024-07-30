import React from 'react'
import { View, StyleSheet, SafeAreaView, TextInput } from 'react-native';

export default function Search() {
    return (
      <SafeAreaView>
        <TextInput placeholder='Search' autoCapitalize='none' autoCorrect={false} inlineImageLeft='search_icon' style={styles.searchBox} />
      </SafeAreaView>
    );

    
  
}

const styles = StyleSheet.create({
  searchBox: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginLeft: 50,
    marginRight: 50,
  }
})
