import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Card from '../../../components/ui/card';
import StepIndicator from '../../../components/ui/step-indicator';
import ThemedButton from '../../../components/ui/themed-button';
import { ThemedText } from '../../../components/ui/themed-text';
import { ThemedView } from '../../../components/ui/themed-view';
import { useRegistration } from '../../../contexts/registration-context';
import { BORDER_RADIUS, COLORS, SPACING } from '../../../lib/theme';

export default function RegisterLocation() {
  const { data, updateData } = useRegistration();
  const [location, setLocation] = useState(data.location);

  const handleNext = () => {
    if (!location.trim()) { Alert.alert('Location required', 'Please enter your location'); return; }
    updateData({ location: location.trim() });
    router.push('/(tabs)/register/profile');
  };

  return (
    <ThemedView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ThemedText type="default" style={styles.backText}>← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.headerTitle}>LOCATION</ThemedText>
            <StepIndicator currentStep={1} totalSteps={4} />
          </View>

          <Card style={styles.card}>
            <View style={styles.illustrationWrap}>
              <ThemedText style={styles.illustIcon}>📍</ThemedText>
            </View>

            <ThemedText type="subtitle" style={styles.cardTitle}>What's your location?</ThemedText>
            <ThemedText type="default" style={styles.cardSubtitle}>
              Find an artist or music near your location.
            </ThemedText>

            <ThemedText type="small" style={styles.label}>Location</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Add your location"
              placeholderTextColor={COLORS.textMuted}
              value={location}
              onChangeText={setLocation}
              returnKeyType="done"
              onSubmitEditing={handleNext}
            />
          </Card>

          <ThemedButton title="Next" onPress={handleNext} disabled={!location.trim()} size="large" style={styles.nextBtn} />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, padding: SPACING.lg },
  header:      { paddingTop: SPACING.lg, marginBottom: SPACING.xl },
  backBtn:     { marginBottom: SPACING.sm },
  backText:    { color: COLORS.primary, fontSize: 16 },
  headerTitle: { textAlign: 'center', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.sm },
  card:        { marginBottom: SPACING.lg },
  illustrationWrap: { height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  illustIcon:  { fontSize: 80 },
  cardTitle:   { textAlign: 'center', marginBottom: SPACING.xs },
  cardSubtitle:{ textAlign: 'center', color: COLORS.textSecondary, marginBottom: SPACING.lg },
  label: { marginBottom: 4, color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { height: 50, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md, fontSize: 15, backgroundColor: COLORS.inputBg, color: COLORS.textPrimary },
  nextBtn: { width: '100%' },
});