import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useAuthContext } from "../contexts/auth-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LottiesView } from "../components/LottieView";
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

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen(props: Props): React.JSX.Element {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const { setToken } = useAuthContext();

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
      } catch (error: any) {
        console.log("ERROR ==>", error.response.data);
      }
    };
    fetchData();
  };

  return (
    <KeyboardAwareScrollView>
      <View>
        <StyledTextInput
          className="text-xl"
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setErrorMessage("");
            setEmail(text);
          }}
        />

        <StyledView className="flex-row gap-8">
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
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <FontAwesome5 name="eye" size={24} color="black" />
            ) : (
              <FontAwesome5 name="eye-slash" size={24} color="black" />
            )}
          </TouchableOpacity>
        </StyledView>

        <Text>{errorMessage && errorMessage}</Text>

        <TouchableOpacity
          onPress={async () => {
            Submit();
          }}
        >
          <Text>Sign in</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>No account ? Register</Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAwareScrollView>
  );
}
