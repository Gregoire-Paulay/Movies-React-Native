import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { withExpoSnack } from "nativewind";
import { useAuthContext } from "../contexts/auth-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Icon import
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// Screens Import
import PopularMoviesScreen from "../screens/PopularMoviesScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
  Popular: undefined;
  Login: undefined;
  Signup: undefined;
  Search: undefined;
  Profile: undefined;
};
export type RootTabParamList = {
  TabPopular: undefined;
  TabSearch: undefined;
  TabProfile: undefined;
};

// Initialization Tab
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const Nav = () => {
  const { userToken, setUserToken } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      setUserToken(userToken);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    return null;
  }

  return (
    <NavigationContainer>
      {!userToken ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen
            name="TabPopular"
            options={{
              tabBarLabel: "Popular",
              tabBarIcon: () => (
                <Ionicons name="home" size={24} color="black" />
              ),
            }}
          >
            {() => (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Popular" component={PopularMoviesScreen} />
              </Stack.Navigator>
            )}
          </Tab.Screen>

          <Tab.Screen
            name="TabSearch"
            options={{
              tabBarLabel: "Search",
              tabBarIcon: () => (
                <MaterialCommunityIcons
                  name="movie-open"
                  size={24}
                  color="black"
                />
              ),
            }}
          >
            {() => (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Search" component={PopularMoviesScreen} />
              </Stack.Navigator>
            )}
          </Tab.Screen>

          <Tab.Screen
            name="TabProfile"
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: () => (
                <AntDesign name="profile" size={24} color="black" />
              ),
            }}
          >
            {() => (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </Stack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default withExpoSnack(Nav);