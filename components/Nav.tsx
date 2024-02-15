import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withExpoSnack } from "nativewind";
import { useAuthContext } from "../contexts/auth-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Icon import
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// Screens Import
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PopularMoviesScreen from "../screens/PopularMoviesScreen";
import SearchMoviesScreen from "../screens/SearchMoviesScreen";
import MovieDetailScreen from "../screens/MovieDetails";
import ReviewCreateScreen from "../screens/ReviewCreateScreen";
import UserReviewsScreen from "../screens/UserReviewsScreen";

export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Popular: undefined;
  Search: undefined;
  Profile: undefined;
  Details: any;
  Review: any;
  DetailsSearch: any;
};
export type RootTabParamList = {
  TabPopular: undefined;
  TabSearch: undefined;
  TabProfile: undefined;
};
export type RootSwipeParamList = {
  UserProfile: undefined;
  UserReviews: undefined;
};

// Initialization Tab
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const Swipe = createMaterialTopTabNavigator<RootSwipeParamList>();

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
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              headerTitleAlign: "center",
            }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarLabelStyle: { fontSize: 16 },
            tabBarStyle: { backgroundColor: "#1E1E1E" },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#595959",
          }}
        >
          <Tab.Screen
            name="TabPopular"
            options={{
              tabBarLabel: "Popular",
              tabBarIcon: () => (
                <Ionicons name="home" size={24} color="#ffffff" />
              ),
            }}
          >
            {() => (
              <Stack.Navigator>
                <Stack.Screen
                  name="Popular"
                  component={PopularMoviesScreen}
                  options={{
                    headerTitleAlign: "center",
                    headerTitle: "Popular Movies",
                  }}
                />
                <Stack.Screen
                  name="Details"
                  component={MovieDetailScreen}
                  options={{
                    headerTitleAlign: "center",
                    headerTitle: "Movie Details",
                  }}
                />
                <Stack.Screen
                  name="Review"
                  component={ReviewCreateScreen}
                  options={{
                    headerTitleAlign: "center",
                    headerTitle: "Review's Creation",
                  }}
                />
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
                  color="#ffffff"
                />
              ),
            }}
          >
            {() => (
              <Stack.Navigator>
                <Stack.Screen
                  name="Search"
                  component={SearchMoviesScreen}
                  options={{
                    headerTitleAlign: "center",
                    headerTitle: "Movies Search",
                    // headerStyle: { backgroundColor: "#1E1E1E" },
                    // headerTintColor: "#ffffff",
                  }}
                />
                <Stack.Screen
                  name="DetailsSearch"
                  component={MovieDetailScreen}
                  options={{
                    headerTitleAlign: "center",
                    headerTitle: "Movie Details",
                  }}
                />
              </Stack.Navigator>
            )}
          </Tab.Screen>

          <Tab.Screen
            name="TabProfile"
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: () => (
                <AntDesign name="profile" size={24} color="#ffffff" />
              ),
            }}
          >
            {/* {() => (
              <Stack.Navigator>
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </Stack.Navigator>
            )} */}
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Profile">
                  {() => (
                    <Swipe.Navigator
                      screenOptions={() => ({
                        tabBarLabelStyle: { fontSize: 16 },
                        tabBarStyle: { backgroundColor: "#1E1E1E" },
                        tabBarActiveTintColor: "#FFF",
                        tabBarInactiveTintColor: "#595959",
                        tabBarIndicatorStyle: {
                          backgroundColor: "#5C48D3",
                        },
                      })}
                    >
                      <Swipe.Screen
                        name="UserProfile"
                        options={{
                          tabBarLabel: "Profile",
                        }}
                        component={ProfileScreen}
                      />
                      <Swipe.Screen
                        name="UserReviews"
                        options={{
                          tabBarLabel: "Reviews",
                        }}
                        component={UserReviewsScreen}
                      />
                    </Swipe.Navigator>
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default withExpoSnack(Nav);
