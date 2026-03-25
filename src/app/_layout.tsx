import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pacientes" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle del paciente" }} />
    </Stack>
  );
};

export default RootLayout;
