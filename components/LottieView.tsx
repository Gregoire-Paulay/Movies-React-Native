import LottieView from "lottie-react-native";
import { View } from "react-native";

export const LottiesView = () => {
  return (
    <View
      style={{
        backgroundColor: "#111111",
        display: "flex",
        alignItems: "center",
        paddingBottom: "110%",
        paddingTop: "20%",
        paddingRight: "10%",
      }}
    >
      <LottieView
        style={{
          width: "60%",
          aspectRatio: 1,
        }}
        source={require("../utils/lotties/popcorn.json")}
        autoPlay
        loop
      />
    </View>
  );
};
