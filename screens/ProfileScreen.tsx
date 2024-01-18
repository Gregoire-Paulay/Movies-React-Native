import axios from "axios";
import { useAuthContext } from "../contexts/auth-context";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { Text, View, TouchableOpacity, Image } from "react-native";

// Schema
import { z, ZodError } from "zod";
import { ProfileSchema, EmailSchema } from "../utils/zodSchema/UserSchema";
import { ParsedData } from "../utils/tools/parsedData";
type TProfile = z.infer<typeof ProfileSchema>;
type TEmail = z.infer<typeof EmailSchema>;

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

  // Error
  const [error, setError] = useState<Error | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  //Change User data
  const [email, setEmail] = useState<string>("");

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

  const handleUpdate = async () => {
    if (email) {
      try {
        const parsedData: TEmail | null = ParsedData<TEmail | null>(
          {
            email,
          },
          EmailSchema,
          zodError,
          setZodError
        );

        const { data } = await axios.put(
          "https://site--movies--hpyqm5px6d9r.code.run/user/email",
          parsedData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        alert(data.message);
      } catch (error) {
        if (zodError) {
          // console.log("erreur Zod");
          zodError.issues.map((error) => {
            console.log(error.message);
          });
        }
        // console.log(error);
      }
    }
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
    <StyledView className="items-center">
      <StyledImage
        source={{
          uri: userData?.avatar,
        }}
        className="w-36 h-36 rounded-full border-2"
      />
      <StyledView className="flex-row gap-8 items-center">
        <StyledText className="text-lg">{userData?.email}</StyledText>
        <StyledTouchableOpacity>
          <StyledText
            onPress={() => {
              setEmail("greg@mail.com"), handleUpdate();
            }}
          >
            Change Mail
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
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
