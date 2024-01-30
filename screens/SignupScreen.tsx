import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/auth-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome5 } from "@expo/vector-icons";
import { Text, TextInput, View, TouchableOpacity } from "react-native";

// Schema
import { ZodError, z } from "zod";
import { SignupSchema } from "../utils/zodSchema/UserSchema";
import { ParsedData } from "../utils/tools/parsedData";
type TSignup = z.infer<typeof SignupSchema>;

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
type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const { setToken } = useAuthContext();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // constante pour gérer l'affichage du mot de passe
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Error
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const resetError = () => {
    setErrorMessage("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
  };

  const Submit = async () => {
    resetError();
    if (!username || !email || !password || !confirmPassword) {
      return setErrorMessage("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return setErrorMessage(
        "The password and confirm password must be the same"
      );
    } else {
      try {
        const parsedData: TSignup | null = ParsedData<TSignup | null>(
          { username, email, password },
          SignupSchema,
          zodError,
          setZodError
        );
        const response = await axios.post(
          "https://site--movies--hpyqm5px6d9r.code.run/user/signup",
          parsedData
        );

        // console.log(response.data);
        alert("Account created");
        const userToken = response.data.token;
        setToken(userToken);
      } catch (error: any) {
        zodError?.issues.map((error) => {
          if (error.path[0] === "username") {
            setUsernameError(error.message);
          } else if (error.path[0] === "email") {
            setEmailError(error.message);
          } else if (error.path[0] === "password") {
            setPasswordError(error.message);
          }
        });

        if (error.response.data === "This mail is already in use") {
          console.log("Error ===>", error.response.data);
          setErrorMessage(error.response.data);
        }
      }
    }
  };

  return (
    <StyledKeyboardAwareScrollView className="bg-gray-900">
      <StyledView className="items-center gap-y-12 mt-8">
        <StyledTextInput
          className="text-xl border-2 rounded-xl py-2 pl-3 w-3/4 bg-gray-100"
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
            resetError();
            setUsername(text);
          }}
        />
        <StyledTextInput
          className="text-xl border-2 rounded-xl py-2 pl-3 w-3/4 bg-gray-100"
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            resetError();
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
              resetError();
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

        <StyledView className="flex-row justify-between border-2 w-3/4 py-2 px-3 rounded-xl bg-gray-100">
          <StyledTextInput
            className="text-xl"
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              resetError();
              setConfirmPassword(text);
            }}
          />
          <StyledTouchableOpacity
            onPress={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
          >
            {showConfirmPassword ? (
              <FontAwesome5 name="eye-slash" size={24} color="black" />
            ) : (
              <FontAwesome5 name="eye" size={24} color="black" />
            )}
          </StyledTouchableOpacity>
        </StyledView>

        {errorMessage ? (
          <StyledView>
            <StyledText className="text-red-500 font-bold text-center mt-2 text-xl">
              {errorMessage && errorMessage}
            </StyledText>
          </StyledView>
        ) : (
          <StyledView>
            {usernameError && (
              <StyledText className="text-red-500 font-bold text-center mt-2 text-xl">
                {usernameError}
              </StyledText>
            )}

            {emailError && (
              <StyledText className="text-red-500 font-bold text-center mt-2 text-xl">
                {emailError}
              </StyledText>
            )}

            {passwordError && (
              <StyledText className="text-red-500 font-bold text-center mt-2 text-xl">
                {passwordError}
              </StyledText>
            )}
          </StyledView>
        )}

        <StyledTouchableOpacity
          className="bg-emerald-700 rounded-xl px-5 py-2"
          onPress={() => Submit()}
        >
          <StyledText className="text-white text-3xl font-bold shadow">
            Create Account
          </StyledText>
        </StyledTouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <StyledText className="text-white text-lg">
            Already have an account ? Log In
          </StyledText>
        </TouchableOpacity>
      </StyledView>
    </StyledKeyboardAwareScrollView>
  );
}
