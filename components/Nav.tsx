import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { withExpoSnack } from "nativewind";

// Icon import
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// Screens Import
import PopularMoviesScreen from "../screens/PopularMoviesScreen";

export type RootStackParamList = {
  Popular: undefined;
  Login: undefined;
  Signin: undefined;
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
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="TabPopular"
          options={{
            tabBarLabel: "Popular",
            tabBarIcon: () => <Ionicons name="home" size={24} color="black" />,
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
              <Stack.Screen name="Profile" component={PopularMoviesScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default withExpoSnack(Nav);
