import axios from "axios";
import { useAuthContext } from "../contexts/auth-context";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";

// Schema
import { z, ZodError } from "zod";
import { GetReviewsUser } from "../utils/zodSchema/ReviewSchema";
import { ParsedData } from "../utils/tools/parsedData";
type TReviews = z.infer<typeof GetReviewsUser>;

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootSwipeParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootSwipeParamList, "UserReviews">;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function UserReviewsScreen(props: Props) {
  const { userToken } = useAuthContext();
  const [reviews, setReviews] = useState<TReviews | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);
  const [showDeleteReview, setShowDeleteReview] = useState<boolean>(false);
  const [reviewID, setReviewID] = useState<string>("");

  // Error
  const [error, setError] = useState<Error | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  useEffect(() => {
    const fetchDataReviews = async () => {
      try {
        const { data } = await axios.get(
          "https://site--movies--hpyqm5px6d9r.code.run/reviews/user",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        // console.log(data);

        const parsedData: TReviews | null = ParsedData<TReviews | null>(
          data,
          GetReviewsUser,
          zodError,
          setZodError
        );
        // console.log(parsedData);

        setReviews(parsedData);
        setIsLoading(false);
      } catch (error) {
        setError(new Error("An error occured !!!"));
      }
    };
    fetchDataReviews();
  }, [refresh, reviews]);

  const DeleteReview = (movieId: string) => {
    const Delete = async () => {
      try {
        const { data } = await axios.delete(
          `https://site--movies--hpyqm5px6d9r.code.run/review/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        // console.log(data);
        alert(data);
        setRefresh(refresh + 1);
      } catch (error) {
        console.log(error);
      }
    };
    Delete();
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
    <StyledView className="bg-slate-700 items-center">
      {showDeleteReview ? (
        <StyledView className="items-center">
          <StyledText className="text-2xl font-bold mt-8 text-white mb-8">
            Do you wanna delete your review?
          </StyledText>

          <StyledView className="flex-row gap-32">
            <StyledTouchableOpacity
              className="border-2 rounded-full p-2 bg-slate-300"
              onPress={() => {
                DeleteReview(reviewID);
                setShowDeleteReview(false);
              }}
            >
              <FontAwesome5 name="check" size={40} color="green" />
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              className="border-2 rounded-full py-2 px-3 bg-slate-300"
              onPress={() => {
                setShowDeleteReview(false);
              }}
            >
              <FontAwesome name="close" size={40} color="red" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      ) : reviews?.length ? (
        <StyledView className="w-full items-center">
          <StyledText className="text-2xl font-bold text-white mt-4">
            Mes Reviews
          </StyledText>
          {reviews?.map((review) => {
            return (
              <StyledView
                key={review._id}
                className="border-2 w-11/12 mt-4 mb-2 bg-slate-300 rounded-lg p-2"
              >
                <StyledText className="text-center text-xl font-bold">
                  {review.title}
                </StyledText>
                <StyledText className="font-bold">
                  {review.movieName}
                </StyledText>
                <StyledTouchableOpacity
                  className="absolute right-2 top-2"
                  onPress={() => {
                    setShowDeleteReview(true);
                    setReviewID(review._id);
                  }}
                >
                  <MaterialIcons name="delete" size={32} color="red" />
                </StyledTouchableOpacity>

                <StyledText>{review.opinion}</StyledText>
              </StyledView>
            );
          })}
        </StyledView>
      ) : (
        <StyledText className="text-2xl font-bold text-white mt-4">
          Aucune Review sur votre compte
        </StyledText>
      )}

      <StyledView className="h-screen"></StyledView>
    </StyledView>
  );
}
