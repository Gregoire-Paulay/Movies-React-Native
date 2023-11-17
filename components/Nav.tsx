import { StyleSheet, Text, View } from "react-native";
import { withExpoSnack } from "nativewind";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

const Nav = () => {
  return (
    <StyledView className="flex-1 items-center justify-center bg-black">
      <StyledText className="text-white">C'est le composants Nav</StyledText>
    </StyledView>
  );
};

export default withExpoSnack(Nav);
