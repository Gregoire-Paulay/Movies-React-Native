import axios from "axios";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";

// Schema
import { ZodError, z } from "zod";
import { ParsedData } from "../utils/tools/parsedData";
import { MoviesSchema } from "../utils/zodSchema/MovieSchema";
type TMovies = z.infer<typeof MoviesSchema>;

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootStackParamList, "Search">;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function SearchMoviesScreen({
  navigation,
}: Props): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [moviesData, setMoviesData] = useState<TMovies | null>(null);

  //Error
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const Submit = () => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post(
          `https://site--movies--hpyqm5px6d9r.code.run/movies/search`,
          { title: title }
        );
        console.log(data);

        // const parsedData: TMovies | null = ParsedData<TMovies | null>(
        //   data,
        //   MoviesSchema,
        //   ZodError,
        //   setZodError
        // );

        // setMoviesData(parsedData);
        // console.log(parsedData);
      } catch (error: any) {
        // if (error instanceof ZodError) {
        //   setError(new Error("Erreur de validation Zod"));
        // } else {
        //   setError(new Error("An error occured !!!"));
        // }
      }
    };
    fetchData();
  };
  return (
    <StyledView>
      <StyledText>On cherche des films ici</StyledText>
      <StyledTextInput
        className="text-xl border-2 rounded-xl py-2 pl-3 w-3/4 bg-gray-100"
        placeholder="Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
        }}
      />
      <StyledTouchableOpacity>
        <StyledText
          onPress={async () => {
            Submit();
          }}
        >
          Search
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
}
