import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";

export default function Btn() {
  const handlePress = () => {
    Alert.alert("Button Pressed!");
  };

  return (
    <View style={styles.containerBtn}>
      <Button title="Press Me" onPress={handlePress} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerBtn: {
    zIndex: 10,
    position: "absolute",
    top: 500,
    left: 150,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
  },
});
