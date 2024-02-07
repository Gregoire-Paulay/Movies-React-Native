import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/auth-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome5 } from "@expo/vector-icons";
import { Text, TextInput, View, TouchableOpacity } from "react-native";

// Schema
import { ZodError, z } from "zod";
import { LoginSchema } from "../utils/zodSchema/UserSchema";
import { ParsedData } from "../utils/tools/parsedData";
type TLogin = z.infer<typeof LoginSchema>;

// Tailwind CSS
import { styled } from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props): React.JSX.Element {
  const { setToken } = useAuthContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Error
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [zodError, setZodError] = useState<ZodError | null>(null);

  // constante pour gérer l'affichage du mot de passe
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const Submit = () => {
    const fetchData = async () => {
      try {
        setErrorMessage("");

        const parsedData: TLogin | null = ParsedData<TLogin | null>(
          { email, password },
          LoginSchema,
          zodError,
          setZodError
        );
        const response = await axios.post(
          "https://site--movies--hpyqm5px6d9r.code.run/user/login",
          parsedData
        );

        // console.log(response.data);
        const userToken = response.data.token;
        setToken(userToken);
      } catch (error) {
        return setErrorMessage("Email or password incorrect");
      }
    };
    fetchData();
  };

  return (
    <StyledKeyboardAwareScrollView className="bg-gray-900">
      <StyledView className="items-center gap-y-12 mt-8">
        <StyledTextInput
          className="text-xl border-2 rounded-xl py-2 pl-3 w-3/4 bg-gray-100"
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setErrorMessage("");
            setEmail(text.toLowerCase());
          }}
        />

        <StyledView className="flex-row justify-between border-2 w-3/4 py-2 px-3 rounded-xl bg-gray-100">
          <StyledTextInput
            className="text-xl"
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setErrorMessage("");
              setPassword(text);
            }}
          />
          <StyledTouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <FontAwesome5 name="eye-slash" size={24} color="black" />
            ) : (
              <FontAwesome5 name="eye" size={24} color="black" />
            )}
          </StyledTouchableOpacity>
        </StyledView>

        <StyledText className="text-red-500 font-bold text-center mt-2 text-xl">
          {errorMessage && errorMessage}
        </StyledText>

        <StyledTouchableOpacity
          className="bg-emerald-700 rounded-xl px-5 py-2"
          onPress={async () => {
            Submit();
          }}
        >
          <StyledText className="text-white text-3xl font-bold shadow">
            Sign in
          </StyledText>
        </StyledTouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          <StyledText className="text-white text-lg">
            No account ? Register
          </StyledText>
        </TouchableOpacity>
      </StyledView>
    </StyledKeyboardAwareScrollView>
  );
}
