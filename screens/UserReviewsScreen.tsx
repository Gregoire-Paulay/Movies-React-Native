import axios from "axios";
import { useAuthContext } from "../contexts/auth-context";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View } from "react-native";

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

export default function UserReviewsScreen(props: Props) {
  const { userToken } = useAuthContext();
  const [reviews, setReviews] = useState<TReviews | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    <StyledView className="bg-slate-700">
      {reviews?.map((review) => {
        return (
          <StyledView key={review._id} className="border-2">
            <StyledText>{review.title}</StyledText>
            <StyledText>{review.opinion}</StyledText>
            <StyledText>{review.movieName}</StyledText>
          </StyledView>
        );
      })}
      <StyledView className="h-screen"></StyledView>
    </StyledView>
  );
}
