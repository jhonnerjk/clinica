import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { User } from "../models/User";
import { usePatients } from "../hooks/usePatients";

const PatientCard = ({
  patient,
  onOpen,
  onDelete,
  deleting,
}: {
  patient: User;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
  deleting: boolean;
}) => (
  <Pressable style={styles.card} onPress={() => onOpen(patient.id)}>
    <Text style={styles.name}>{patient.name}</Text>
    <Text style={styles.meta}>{patient.email}</Text>
    <Text style={styles.meta}>{patient.company?.name ?? "Sin empresa"}</Text>

    <Pressable
      style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
      onPress={(event: GestureResponderEvent) => {
        event.stopPropagation();
        onDelete(patient.id);
      }}
      disabled={deleting}
    >
      <Text style={styles.deleteButtonText}>{deleting ? "Eliminando..." : "Eliminar"}</Text>
    </Pressable>
  </Pressable>
);

const HomeScreen = () => {
  const router = useRouter();
  const { patients, loading, refreshing, error, deletingId, reload, refresh, removePatient } =
    usePatients();

  const handleOpenPatient = (id: number) => {
    router.push({
      pathname: "/[id]",
      params: { id: String(id) },
    });
  };

  const handleDeletePatient = (id: number) => {
    Alert.alert("Eliminar paciente", "Estas seguro de que deseas eliminar este paciente?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          void removePatient(id);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Cargando pacientes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={reload}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (patients.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>No hay pacientes disponibles.</Text>
        <Pressable style={styles.retryButton} onPress={reload}>
          <Text style={styles.retryButtonText}>Recargar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={patients}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            deleting={deletingId === item.id}
            onOpen={handleOpenPatient}
            onDelete={handleDeletePatient}
          />
        )}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e0e6ef",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14213d",
  },
  meta: {
    fontSize: 14,
    color: "#4f5d75",
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#e63946",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#f3f6fb",
  },
  infoText: {
    fontSize: 16,
    color: "#4f5d75",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#c1121f",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#1d3557",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default HomeScreen;
