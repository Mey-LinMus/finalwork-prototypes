import { View, Image, StyleSheet } from "react-native";

export default function Img() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/relax.png")} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
