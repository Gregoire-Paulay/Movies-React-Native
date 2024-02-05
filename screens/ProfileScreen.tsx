import axios from "axios";
import { useAuthContext } from "../contexts/auth-context";
import React, { useEffect, useState } from "react";
import { LottiesView } from "../components/LottieView";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Text, View, TouchableOpacity, Image, TextInput } from "react-native";

// Schema
import { z, ZodError } from "zod";
import {
  ProfileSchema,
  EmailSchema,
  UsernameSchema,
  AvatarSchema,
} from "../utils/zodSchema/UserSchema";
import { ParsedData } from "../utils/tools/parsedData";
type TProfile = z.infer<typeof ProfileSchema>;
type TEmail = z.infer<typeof EmailSchema>;
type TUsername = z.infer<typeof UsernameSchema>;
type TAvatar = z.infer<typeof AvatarSchema>;

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ProfileScreen(props: Props): React.JSX.Element {
  const { setToken, userToken } = useAuthContext();

  const [userData, setUserData] = useState<TProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);

  // Error
  const [error, setError] = useState<Error | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  //Change User data
  const [showMailChange, setShowMailChange] = useState<boolean>(false);
  const [showUsernameChange, setShowUsernameChange] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  // Gestion des changements pour l'utilisateur
  const handleUpdate = async () => {
    console.log("Dans handleUpdate");

    if (email) {
      try {
        // console.log("Dans changemail");

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
      } catch (error: any) {
        console.log(error);
        if (zodError) {
          // console.log("erreur Zod");
          zodError.issues.map((error) => {
            console.log("Error mail", error);
          });
        }
      }
    }

    if (username) {
      if (username.length >= 3) {
        try {
          // console.log("Dans Change Username");

          const parsedData: TUsername | null = ParsedData<TUsername | null>(
            { username },
            UsernameSchema,
            zodError,
            setZodError
          );
          const { data } = await axios.put(
            "https://site--movies--hpyqm5px6d9r.code.run/user/username",
            parsedData,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "Application/json",
              },
            }
          );
          console.log(data);
          alert(data.message);
        } catch (error: any) {
          console.log("Erreur", error);
          if (zodError) {
            zodError.issues.map((error) => {
              console.log(error);
            });
          }
        }
      } else {
        // console.log("Trop court");
        alert("Username too short, need to be at least 3 characters");
      }
    }

    if (avatar) {
      const tab = avatar.split(".");
      console.log(tab.at(-1));

      const formData: any = new FormData();
      formData.append("avatar", {
        uri: avatar,
        name: `avatar.${tab.at(-1)}`,
        type: `image/${tab.at(-1)}`,
      });

      try {
        console.log("AXIOS");

        const response = await axios.put(
          "https://site--movies--hpyqm5px6d9r.code.run/user/avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Update", response.data);
      } catch (error: any) {
        console.log("ERROR ==>", error);
      }
    }

    setRefresh(refresh + 1);
  };

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
  }, [refresh]);

  const getPermissionToOpenLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // console.log(status);

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      // console.log(result);
      if (result.canceled) {
        alert("Aucune photo n'a été sélectionée");
      } else {
        setAvatar(result.assets[0].uri);
      }
    } else {
      alert(
        "Accès non autorisé, si vous voulez autorisez l'accès à la galerie de photos aller dans Réglages ==> Photos"
      );
    }
  };

  const getPermissionToOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    // console.log(status);

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      // console.log(result);
      if (result.canceled) {
        alert("No picture selected");
      } else {
        setAvatar(result.assets[0].uri);
      }
    } else {
      alert(
        "Accès non autorisé, pour autorisé l'accès à votre caméra, aller dans Réglages ===> Appareil Photo"
      );
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

  // console.log(userData?.avatar);

  return (
    <StyledView className="items-center">
      <StyledView>
        <StyledView className="flex-row items-center gap-8">
          <StyledImage
            source={{
              uri: userData?.avatar,
            }}
            className="w-36 h-36 rounded-full border-2"
          />
          <StyledView className="">
            <StyledTouchableOpacity onPress={getPermissionToOpenLibrary}>
              <FontAwesome name="photo" size={24} color="black" />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity onPress={getPermissionToOpenCamera}>
              <FontAwesome name="camera" size={24} color="black" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {avatar && (
          <StyledView className="">
            <StyledImage source={{ uri: avatar }} className="w-36 h-36" />
            {/* <StyledText>{avatar}</StyledText> */}
            <StyledTouchableOpacity
              onPress={() => {
                handleUpdate();
              }}
            >
              <FontAwesome5 name="check" size={40} color="green" />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => {
                setAvatar("");
              }}
            >
              <FontAwesome name="close" size={40} color="red" />
            </StyledTouchableOpacity>
          </StyledView>
        )}
      </StyledView>

      <StyledView className="border-2 w-11/12 items-center mb-8 mt-4 bg-slate-400 rounded-md">
        <StyledText className="text-2xl font-bold pb-2">MAIL</StyledText>
        <StyledView className="flex-row gap-8 items-center mb-2">
          <StyledText className="text-xl">{userData?.email}</StyledText>
          <StyledTouchableOpacity
            className="p-2"
            onPress={() => {
              setShowMailChange(true);
            }}
          >
            <FontAwesome5 name="pen" size={24} color="black" />
          </StyledTouchableOpacity>
        </StyledView>

        {showMailChange && (
          <StyledView className="flex-row gap-8 items-center px-4 pb-2">
            <StyledTextInput
              className="text-xl border-2 rounded-xl py-2 px-3 w-3/5 bg-white"
              placeholder="New Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
            <StyledTouchableOpacity
              onPress={() => {
                handleUpdate();
              }}
            >
              <FontAwesome5 name="check" size={40} color="green" />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => {
                setShowMailChange(false);
              }}
            >
              <FontAwesome name="close" size={40} color="red" />
            </StyledTouchableOpacity>
          </StyledView>
        )}
      </StyledView>

      <StyledView className="border-2 w-11/12 items-center mb-8 bg-slate-400 rounded-md">
        <StyledText className="text-2xl font-bold pb-2">USERNAME</StyledText>
        <StyledView className="flex-row gap-8 items-center">
          <StyledText className="text-xl">{userData?.username}</StyledText>
          <StyledTouchableOpacity
            className="p-2"
            onPress={() => {
              setShowUsernameChange(true);
            }}
          >
            <FontAwesome5 name="pen" size={24} color="black" />
          </StyledTouchableOpacity>
        </StyledView>

        {showUsernameChange && (
          <StyledView className="flex-row gap-8 items-center px-4 pb-2">
            <StyledTextInput
              className="text-xl border-2 rounded-xl py-2 px-3 w-3/5 bg-white"
              placeholder="New Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
              }}
            />
            <StyledTouchableOpacity
              onPress={() => {
                handleUpdate();
              }}
            >
              <FontAwesome5 name="check" size={40} color="green" />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => {
                setShowUsernameChange(false);
              }}
            >
              <FontAwesome name="close" size={40} color="red" />
            </StyledTouchableOpacity>
          </StyledView>
        )}
      </StyledView>

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
