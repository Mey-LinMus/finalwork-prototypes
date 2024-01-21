import React from 'react';
import { View, Button, Alert } from 'react-native';

const MyComponent = () => {
  const handlePress = () => {
    Alert.alert('Button Pressed!');
  };

  return (
    <View>
      <Button title="Press Me" onPress={handlePress} />
    </View>
  );
};

export default MyComponent;
