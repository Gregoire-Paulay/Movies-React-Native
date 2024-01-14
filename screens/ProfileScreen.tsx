import axios from "axios";
import { useAuthContext } from "../contexts/auth-context";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View, TouchableOpacity, Image } from "react-native";

// Schema
import { z } from "zod";
import { ProfileSchema } from "../utils/zodSchema/UserSchema";
type TProfile = z.infer<typeof ProfileSchema>;

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ProfileScreen(props: Props): React.JSX.Element {
  const { setToken, userToken } = useAuthContext();

  const [userData, setUserData] = useState<TProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://site--movies--hpyqm5px6d9r.code.run/user/profile",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        // console.log(response.data);

        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(new Error("An error occured !!!"));
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
    <StyledView>
      <StyledImage
        source={{
          uri: userData?.avatar,
        }}
        className="w-10/12 h-48 rounded-md"
      />
      <StyledText>{userData?.email}</StyledText>
      <StyledText>{userData?.username}</StyledText>

      <StyledTouchableOpacity
        className=""
        onPress={() => {
          setToken(null);
        }}
      >
        <StyledText className="text-xl">Disconnect</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
}
