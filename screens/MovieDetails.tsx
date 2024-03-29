import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/auth-context";
import { LottiesView } from "../components/LottieView";
import userIcon from "../assets/image/user-icon.jpg";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// Schema
import { ZodError, z } from "zod";
import { ParsedData } from "../utils/tools/parsedData";
import { MoviesDetailsSchema } from "../utils/zodSchema/MovieSchema";
import { GetReviewSchema } from "../utils/zodSchema/ReviewSchema";
type TMovies = z.infer<typeof MoviesDetailsSchema>;
type TReview = z.infer<typeof GetReviewSchema>;

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
import { useRoute } from "@react-navigation/core";
type Props = NativeStackScreenProps<
  RootStackParamList,
  "Details" | "DetailsSearch"
>;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

// REFRESH
// export class Props {refreshTimeStamp:string | undefined}

export default function MovieDetailScreen({
  navigation,
}: Props): React.JSX.Element {
  const { params }: any = useRoute();
  const { userToken } = useAuthContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [finishloading, setFinishLoading] = useState<boolean>(false);
  const [moviesData, setMoviesData] = useState<TMovies | null>(null);
  const [reviews, setReviews] = useState<TReview | null>(null);

  // Error
  const [error, setError] = useState<Error | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const { data } = await axios.get(
          `https://site--movies--hpyqm5px6d9r.code.run/movies/details/${params.movie_id}`
        );

        const parsedData: TMovies | null = ParsedData<TMovies | null>(
          data,
          MoviesDetailsSchema,
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

  useEffect(() => {
    const fetchDataReview = async () => {
      try {
        const { data } = await axios.get(
          `https://site--movies--hpyqm5px6d9r.code.run/review/${params.movie_id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        // console.log(data);

        const parsedData: TReview | null = ParsedData<TReview | null>(
          data,
          GetReviewSchema,
          zodError,
          setZodError
        );

        setReviews(parsedData);
        setFinishLoading(true);
        // console.log("Parse", parsedData);
      } catch (error: any) {
        console.log("ERROR ==>", error);
      }
    };
    fetchDataReview();
  }, [isLoading]);

  if (error)
    return (
      <StyledView className="items-center justify-center h-full bg-slate-700">
        <StyledText className="text-red-700 mt-4 font-bold text-2xl ">
          Error: {error.message}
        </StyledText>
      </StyledView>
    );
  if (!finishloading) {
    return <LottiesView />;
  }

  return (
    <StyledScrollView>
      <StyledView className="flex-1 items-center bg-slate-900 pb-12">
        <StyledText className="text-2xl text-center font-bold color-white pt-2">
          {moviesData?.title}
        </StyledText>
        <StyledView className="flex-row gap-4 pb-4">
          {moviesData?.genres.map((genre) => {
            return (
              <StyledText
                key={genre.id}
                className="color-white border-2 border-stone-100 rounded-lg px-2 text-center py-0.5"
              >
                {genre.name}
              </StyledText>
            );
          })}
        </StyledView>

        {/* Movie Poster */}
        <StyledView
          className="w-10/12 rounded-md border-2"
          style={styles.height}
        >
          <StyledImage
            source={{
              uri: `https://image.tmdb.org/t/p/w500` + moviesData?.poster_path,
            }}
            className="w-full h-full rounded-md"
          />
        </StyledView>
        <StyledText className="color-white px-2 text-center pt-2 text-lg mb-6">
          {moviesData?.overview}
        </StyledText>

        {/* Movie Data */}
        <StyledView className="border-2 bg-slate-600 rounded-lg w-8/12 gap-1">
          <StyledText className="color-white text-center text-base">
            Release Date: {moviesData?.release_date}
          </StyledText>
          <StyledText className="color-white text-center text-base">
            Runtime: {moviesData?.runtime} minute
          </StyledText>
          <StyledText className="color-white text-center text-base pb-3">
            Rating: {moviesData?.vote_average} / 10 with{" "}
            {moviesData?.vote_count} vote
          </StyledText>
        </StyledView>

        {/* Reviews */}
        <StyledTouchableOpacity
          className="border-2 bg-yellow-600 py-1 px-2 rounded-md mt-8"
          onPress={() => {
            navigation.navigate("Review", {
              movieId: moviesData?.id,
              movieName: moviesData?.title,
            });
          }}
        >
          <StyledText className="color-white text-xl font-bold">
            Add a review for this film
          </StyledText>
        </StyledTouchableOpacity>

        <StyledView className="w-11/12 border-2 items-center mt-2 bg-slate-500 rounded-lg">
          {reviews ? (
            <StyledText className="text-2xl color-white font-bold text-center mt-1">
              ALL REVIEWS
            </StyledText>
          ) : (
            <StyledText className="text-2xl color-white font-bold text-center mt-1">
              NO REVIEWS FOR THIS FILM
            </StyledText>
          )}

          {reviews?.map((review) => {
            return (
              <StyledView
                key={review._id}
                className={
                  review.feeling === "Bad"
                    ? "border-2 w-10/12 mt-2 mb-4 items-center justify-center p-1 rounded-md bg-rose-400"
                    : review.feeling === "Good"
                    ? "border-2 w-10/12 mt-2 mb-4 items-center justify-center p-1 rounded-md bg-lime-500"
                    : "border-2 w-10/12 mt-2 mb-4 items-center justify-center p-1 rounded-md bg-slate-400"
                }
              >
                <StyledText className="text-2xl font-bold">
                  {review.title}
                </StyledText>
                <StyledView className="flex-row gap-4 mb-2 items-center">
                  {review.user.account.avatar ? (
                    <StyledImage
                      source={{ uri: review.user.account.avatar }}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <StyledImage
                      source={userIcon}
                      className="w-12 h-12 rounded-full border-2"
                    />
                  )}

                  <StyledText>{review.user.account.username}</StyledText>
                  <StyledText>{review.date}</StyledText>
                </StyledView>
                <StyledText className="text-base">{review.opinion}</StyledText>
              </StyledView>
            );
          })}
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
}

const styles = StyleSheet.create({
  height: {
    height: 550,
  },
});
