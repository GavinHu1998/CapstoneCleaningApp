import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";


const _layout = () => {
  const colorScheme = useColorScheme(); // 适配深色/浅色模式

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#D62A1E", // 选中时的颜色
        tabBarInactiveTintColor: "gray", // 未选中时的颜色
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
