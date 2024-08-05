import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

const StartPage = () => {
  return (
    <View className="flex-1 justify-center">
        <ActivityIndicator size='large' color='#BE3CFB'/>
    </View>
  )
}

export default StartPage