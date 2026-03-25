import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { usePatientDetail } from "../hooks/usePatientDetail";

const PatientDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const parsedId = Number(params.id ?? "");
  const hasValidId = Number.isInteger(parsedId) && parsedId > 0;
  const patientId = hasValidId ? parsedId : null;
  const [saveFeedback, setSaveFeedback] = useState<string>("");

  const { patient, note, setNote, loading, saving, error, savePatientNote, reload } =
    usePatientDetail(patientId);

  const handleNoteChange = (value: string) => {
    setSaveFeedback("");
    setNote(value);
  };

  const handleSaveNote = async () => {
    const saved = await savePatientNote();

    if (saved) {
      setSaveFeedback("Nota guardada correctamente.");
    }
  };

  const goBackToList = () => {
    router.replace("/");
  };

  if (!hasValidId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>ID de paciente invalido.</Text>
        <Pressable style={styles.primaryButton} onPress={goBackToList}>
          <Text style={styles.primaryButtonText}>Volver a pacientes</Text>
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Cargando detalle del paciente...</Text>
      </View>
    );
  }

  if (error && !patient) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.primaryButton} onPress={reload}>
          <Text style={styles.primaryButtonText}>Reintentar</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={goBackToList}>
          <Text style={styles.secondaryButtonText}>Volver a pacientes</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{patient?.name}</Text>
        <Text style={styles.meta}>Correo: {patient?.email}</Text>
        <Text style={styles.meta}>Empresa: {patient?.company?.name ?? "Sin empresa"}</Text>
        <Text style={styles.meta}>ID: {patient?.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nota clinica</Text>
        <TextInput
          value={note}
          onChangeText={handleNoteChange}
          placeholder="Escribe la nota del paciente..."
          multiline
          style={styles.input}
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
          onPress={handleSaveNote}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>{saving ? "Guardando..." : "Guardar nota"}</Text>
        </Pressable>

        {saveFeedback ? <Text style={styles.successText}>{saveFeedback}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: "#f3f6fb",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e6ef",
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14213d",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14213d",
  },
  meta: {
    fontSize: 15,
    color: "#4f5d75",
  },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: "#cfd7e6",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#ffffff",
  },
  primaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1d3557",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#1d3557",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: "#1d3557",
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
  successText: {
    fontSize: 14,
    color: "#2a9d8f",
    fontWeight: "600",
  },
});

export default PatientDetailScreen;
