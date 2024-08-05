/* import React from 'react';
import { RefreshControl, View } from 'react-native';
import LottieView from 'lottie-react-native';

const RefreshControlComponent = ({ refreshing, onRefresh }) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="transparent"
      colors={['transparent']}
      style={{ backgroundColor: 'transparent' }}
    >
      {refreshing && (
        <View style={{ aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            source={require('../assets/Animation - 1722275858268.json')}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      )}
    </RefreshControl>
  );
};

export default RefreshControlComponent; */


import React from 'react';
import { RefreshControl } from 'react-native';

const RefreshControlComponent = ({ refreshing, onRefresh }) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#000"
      title="Loading..."
      titleColor="#000"
      colors={['#000']}
      progressBackgroundColor="#fff"
    />
  );
};

export default RefreshControlComponent;
