import { useLocalSearchParams } from "expo-router";
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
  const params = useLocalSearchParams<{ id?: string }>();
  const patientId = Number(params.id ?? "0");

  const { patient, note, setNote, loading, saving, error, savePatientNote, reload } =
    usePatientDetail(patientId);

  if (!patientId || Number.isNaN(patientId)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Invalid patient ID.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Loading patient detail...</Text>
      </View>
    );
  }

  if (error && !patient) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.primaryButton} onPress={reload}>
          <Text style={styles.primaryButtonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{patient?.name}</Text>
        <Text style={styles.meta}>Email: {patient?.email}</Text>
        <Text style={styles.meta}>Company: {patient?.company?.name ?? "No company"}</Text>
        <Text style={styles.meta}>ID: {patient?.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Clinical Note</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Write patient note..."
          multiline
          style={styles.input}
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
          onPress={savePatientNote}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>{saving ? "Saving..." : "Save Note"}</Text>
        </Pressable>

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
});

export default PatientDetailScreen;
