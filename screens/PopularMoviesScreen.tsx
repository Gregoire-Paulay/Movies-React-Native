import axios from "axios";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View } from "react-native";

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

export default function PopularMovies(props: Props): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [moviesData, setMoviesData] = useState<TMovies | null>(null);
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
      <StyledText className="text-red-700 mt-4">
        Error: {error.message}
      </StyledText>
    );
  if (isLoading) {
    return <LottiesView />;
  }

  return (
    <View>
      <StyledView className="flex-1 items-center justify-center bg-black">
        <StyledText className="text-white">
          This is the PopularMovies component
        </StyledText>
      </StyledView>
    </View>
  );
}

// export default withExpoSnack(PopularMovies);
