import axios from "axios";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View } from "react-native";

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
import { useRoute } from "@react-navigation/core";
type Props = NativeStackScreenProps<RootStackParamList, "Review">;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);

export default function ReviewCreateScreen(props: Props): React.JSX.Element {
  const { params }: any = useRoute();

  return <StyledText>{params.movieId}</StyledText>;
}
