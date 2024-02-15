import axios from "axios";
import React, { useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Entypo } from "@expo/vector-icons";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

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
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function SearchMoviesScreen({
  navigation,
}: Props): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [moviesData, setMoviesData] = useState<TMovies | null>(null);

  //Error
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const Submit = () => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.post(
          `https://site--movies--hpyqm5px6d9r.code.run/movies/search`,
          { title: title }
        );
        // console.log(data);

        const parsedData: TMovies | null = ParsedData<TMovies | null>(
          data,
          MoviesSchema,
          zodError,
          setZodError
        );

        setMoviesData(parsedData);
        // console.log(parsedData);
        setIsLoading(false);
      } catch (error: any) {
        if (error instanceof ZodError) {
          setError(new Error("Erreur de validation Zod"));
        } else {
          setError(new Error("An error occured !!!"));
        }
      }
    };
    fetchData();
  };

  if (error)
    return (
      <StyledView className="items-center justify-center h-full bg-slate-700">
        <StyledText className="text-red-700 mt-4 font-bold text-2xl ">
          Error: {error.message}
        </StyledText>
      </StyledView>
    );
  if (isLoading) {
    return <LottiesView />;
  }

  return (
    <StyledScrollView>
      <StyledView className="items-center bg-slate-900">
        <StyledView className="flex-row justify-center items-center gap-4 py-4">
          <StyledView className="text-xl border-2 rounded-xl py-2 px-3 w-3/4 bg-gray-100 flex-row justify-between">
            <StyledTextInput
              className="text-xl"
              placeholder="Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
            <StyledTouchableOpacity onPress={() => setTitle("")}>
              <Entypo name="circle-with-cross" size={30} color="black" />
            </StyledTouchableOpacity>
          </StyledView>
          <StyledTouchableOpacity>
            <StyledText
              className="text-xl font-bold text-white"
              onPress={async () => {
                Submit();
              }}
            >
              Search
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {moviesData ? (
          <StyledView className="w-11/12 items-center gap-4 mt-4">
            {moviesData.results.map((movie) => {
              return (
                <StyledTouchableOpacity
                  key={movie.id}
                  className="w-11/12 items-center bg-slate-700 py-2 rounded-md"
                  onPress={() => {
                    navigation.navigate("DetailsSearch", {
                      movie_id: movie.id,
                    });
                  }}
                >
                  <StyledText className="text-2xl text-center font-bold color-white p-1">
                    {movie.title}
                  </StyledText>
                  <StyledText
                    className="text-center pb-3 pt-1 px-2 text-slate-200"
                    numberOfLines={2}
                  >
                    {movie.overview}
                  </StyledText>

                  {movie.backdrop_path ? (
                    <StyledImage
                      source={{
                        uri:
                          `https://image.tmdb.org/t/p/w500` +
                          movie.backdrop_path,
                      }}
                      className="w-10/12 h-48 rounded-md"
                    />
                  ) : (
                    <StyledImage
                      source={{
                        uri:
                          `https://image.tmdb.org/t/p/w500` + movie.poster_path,
                      }}
                      className="w-10/12 h-48 rounded-md"
                    />
                  )}
                </StyledTouchableOpacity>
              );
            })}
          </StyledView>
        ) : (
          <StyledView className="bg-slate-900 h-screen border-0"></StyledView>
        )}
      </StyledView>
    </StyledScrollView>
  );
}
