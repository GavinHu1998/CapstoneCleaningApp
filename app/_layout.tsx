import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";


const _layout = () => {
  const colorScheme = useColorScheme(); // for dark/ light mode

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#D62A1E", // active selection
        tabBarInactiveTintColor: "gray", // inactive
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashbord",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="porfile"
        options={{
          title: "Porfile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
