import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/auth-context";
import { Text, View, TextInput, TouchableOpacity } from "react-native";

// Schema
import { ZodError, z } from "zod";
import { ReviewSchema } from "../utils/zodSchema/ReviewSchema";
import { ParsedData } from "../utils/tools/parsedData";
type TLogin = z.infer<typeof ReviewSchema>;

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
  const { userToken } = useAuthContext();
  const { params }: any = useRoute();
  const movieId = params.movieId;

  const [title, setTitle] = useState<string>("");
  const [feeling, setFeeling] = useState<"Good" | "Bad" | "Neutral">();
  const [opinion, setOpinion] = useState<string>("");

  // Error
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const Submit = () => {
    const fetchData = async () => {
      try {
        setErrorMessage("");
        if (!title || !feeling || !opinion) {
          return setErrorMessage(
            "Fill all fields and choose your feeling to create a review"
          );
        }

        const parsedData: TLogin | null = ParsedData<TLogin | null>(
          { title, feeling, opinion, movieId },
          ReviewSchema,
          zodError,
          setZodError
        );
        const response = await axios.post(
          `https://site--movies--hpyqm5px6d9r.code.run/review/${movieId}`,
          parsedData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );

        if (
          response.data.message ===
          "This user already posted a review for this film"
        ) {
          setErrorMessage("You already created a review for this film");
        }

        // console.log(response.data.message);
        if (response.data.message === "Review created") {
          alert("Your review has been created");
        }
      } catch (error: any) {
        setErrorMessage(error);
      }
    };
    fetchData();
  };

  return (
    <StyledView className="items-center gap-y-8 h-screen bg-slate-800 pt-12">
      <StyledTextInput
        className="text-xl border-2 rounded-xl py-2 pl-3 w-3/4 bg-gray-100"
        placeholder="Review Title"
        value={title}
        onChangeText={(text) => {
          setErrorMessage("");
          setTitle(text);
        }}
      />

      <StyledView className="flex-row gap-x-4">
        <StyledTouchableOpacity
          className="bg-lime-500 px-4 py-2 rounded-xl"
          onPress={() => {
            setFeeling("Good");
          }}
        >
          <StyledText className="text-white text-2xl font-bold">
            Good
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className="bg-neutral-500 px-4 py-2 rounded-xl"
          onPress={() => {
            setFeeling("Neutral");
          }}
        >
          <StyledText className="text-white text-2xl font-bold">
            Neutral
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className="bg-rose-600 px-4 py-2 rounded-xl"
          onPress={() => {
            setFeeling("Bad");
          }}
        >
          <StyledText className="text-white text-2xl font-bold">Bad</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <StyledTextInput
        className="text-xl border-2 rounded-xl py-2 pl-3 w-3/4 bg-gray-100"
        placeholder="Your opinion of the movie"
        multiline
        numberOfLines={4}
        value={opinion}
        onChangeText={(text) => {
          setErrorMessage("");
          setOpinion(text);
        }}
      />

      <StyledText className="text-red-500 font-bold text-center mt-2 text-xl">
        {errorMessage && errorMessage}
      </StyledText>

      <StyledTouchableOpacity
        className="bg-emerald-700 rounded-xl px-5 py-2"
        onPress={async () => {
          Submit();
        }}
      >
        <StyledText className="text-white text-3xl font-bold shadow">
          Create Review
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
}
