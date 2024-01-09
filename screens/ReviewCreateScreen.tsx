import axios from "axios";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View, TextInput, TouchableOpacity } from "react-native";

// Schema
import { ZodError, z } from "zod";

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
import { useRoute } from "@react-navigation/core";
type Props = NativeStackScreenProps<RootStackParamList, "Review">;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ReviewCreateScreen(props: Props): React.JSX.Element {
  const { params }: any = useRoute();
  const movieId = params.movieId;
  const [title, setTitle] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");
  const [opinion, setOpinion] = useState<string>("");

  // Error
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const Submit = () => {
    const fetchData = async () => {
      try {
        setErrorMessage("");

        // const parsedData: TLogin | null = ParsedData<TLogin | null>(
        //   { email, password },
        //   LoginSchema,
        //   zodError,
        //   setZodError
        // );
        // const response = await axios.post(
        //   "https://site--movies--hpyqm5px6d9r.code.run/user/login",
        //   parsedData
        // );
      } catch (error) {
        return setErrorMessage("Error");
      }
    };
    fetchData();
  };

  return (
    <StyledView className="items-center gap-y-12 mt-8">
      {/* <StyledText>{movieId}</StyledText> */}
      <StyledTextInput
        className="text-xl border-2 rounded-xl py-2 pl-3 w-3/4 bg-gray-100"
        placeholder="Review Title"
        value={title}
        onChangeText={(text) => {
          setErrorMessage("");
          setTitle(text);
        }}
      />
      <StyledView>
        <StyledTouchableOpacity
          onPress={() => {
            setFeeling("Good");
          }}
        >
          <StyledText>Good</StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => {
            setFeeling("Neutral");
          }}
        >
          <StyledText>Neutral</StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => {
            setFeeling("Bad");
          }}
        >
          <StyledText>Bad</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <StyledTouchableOpacity
        className="bg-emerald-700 rounded-xl px-5 py-2"
        // onPress={async () => {
        //   Submit();
        // }}
      >
        <StyledText className="text-white text-3xl font-bold shadow">
          Create Review
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
}
