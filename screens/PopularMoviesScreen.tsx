import axios from "axios";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";

// Schema
import { ZodError, z } from "zod";
import { ParsedData } from "../utils/tools/parsedData";
import { MoviesSchema } from "../utils/zodSchema/MovieSchema";
type TMovies = z.infer<typeof MoviesSchema>;

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootStackParamList, "Popular">;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function PopularMovies({
  navigation,
}: Props): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [moviesData, setMoviesData] = useState<TMovies | null>(null);

  //Error
  const [error, setError] = useState<Error | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const { data } = await axios.get(
          `https://site--movies--hpyqm5px6d9r.code.run/movies/popular?page=1`
        );

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
  }, []);

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
      <StyledView className="flex-1 items-center justify-center gap-4 border-4 bg-slate-900">
        {moviesData?.results.map((movie) => {
          return (
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate("Details", { movie_id: movie.id });
              }}
              key={movie.id}
              className=" w-11/12 items-center bg-slate-700 py-2 rounded-md"
            >
              <StyledText className="text-2xl text-center font-bold color-white pt-1">
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
                      `https://image.tmdb.org/t/p/w500` + movie.backdrop_path,
                  }}
                  className="w-10/12 h-48 rounded-md"
                />
              ) : (
                <StyledImage
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500` + movie.poster_path,
                  }}
                  className="w-10/12 h-48 rounded-md"
                />
              )}
            </StyledTouchableOpacity>
          );
        })}
      </StyledView>
    </StyledScrollView>
  );
}

// export default withExpoSnack(PopularMovies);
