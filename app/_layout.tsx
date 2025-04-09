import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

const _layout = () => {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#D62A1E",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Login",

            tabBarIcon: ({ color, size }) => (
              <Ionicons name="enter-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),

          }}
        />
        <Tabs.Screen
          name="addJob"
          options={{
            title: "addJob",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="temp"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="text" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>

  );
};

export default _layout;
