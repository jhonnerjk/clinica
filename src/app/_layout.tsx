import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Patients" }} />
      <Stack.Screen name="[id]" options={{ title: "Patient Detail" }} />
    </Stack>
  );
};

export default RootLayout;
