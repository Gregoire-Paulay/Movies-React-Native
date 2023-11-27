import { useAuthContext } from "../contexts/auth-context";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";

// Props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen(props: Props): React.JSX.Element {
  const { setToken } = useAuthContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <TouchableOpacity
      onPress={() => {
        setToken(null);
      }}
    >
      <Text>Disconnect</Text>
    </TouchableOpacity>
  );
}
