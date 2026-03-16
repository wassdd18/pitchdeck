import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../../../components/ui/card';
import StepIndicator from '../../../components/ui/step-indicator';
import ThemedButton from '../../../components/ui/themed-button';
import { ThemedText } from '../../../components/ui/themed-text';
import { ThemedView } from '../../../components/ui/themed-view';
import { useAuth } from '../../../contexts/auth-context';
import { useRegistration } from '../../../contexts/registration-context';
import { BORDER_RADIUS, COLORS, SPACING } from '../../../lib/theme';
const SUGGESTIONS = [
  'Chess', 'Music', 'Reading', 'Cooking', 'Hiking', 'Photography',
  'Drawing', 'Gaming', 'Yoga', 'Dancing', 'Coding', 'Travel',
  'Sports', 'Movies', 'Theater', 'Writing', 'Gardening', 'Cycling',
];
const HOBBY_RE = /^[A-Za-zА-Яа-яёЁ\u0590-\u05FF\u0600-\u06FF\s\-]{2,40}$/;

function validateHobby(text) {
  const t = text.trim();
  if (t.length < 2)        return 'Hobby must be at least 2 characters';
  if (t.length > 40)       return 'Hobby must be at most 40 characters';
  if (!HOBBY_RE.test(t))   return 'Hobby should contain only letters';
  return null;
}

export default function RegisterHobbies() {
  const { data, updateData, resetData } = useRegistration();
  const { register, loading }           = useAuth();

  const [hobbies,   setHobbies]   = useState(data.hobbies ?? []);
  const [input,     setInput]     = useState('');
  const [inputErr,  setInputErr]  = useState('');

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const addHobby = (text) => {
    const t = (text ?? input).trim();
    setInputErr('');

    if (!t) return;

    const err = validateHobby(t);
    if (err) { setInputErr(err); return; }

    const normalized = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    if (hobbies.includes(normalized)) {
      setInputErr('This hobby is already added');
      return;
    }
    Animated.sequence([
      Animated.timing(shimmerAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(shimmerAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();

    setHobbies(prev => [...prev, normalized]);
    setInput('');
  };

  const removeHobby = (hobby) => {
    setHobbies(prev => prev.filter(h => h !== hobby));
  };

  const handleFinish = async () => {
    if (hobbies.length < 1) {
      Alert.alert('At least one hobby', 'Please add at least one interest to continue');
      return;
    }

    updateData({ hobbies });

    try {
      await register({
        email:    data.email,
        password: data.password,
        name:     `${data.firstName} ${data.lastName}`.trim(),
      });
      resetData();
      router.replace('/success?type=register');
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
    }
  };

  return (
    <ThemedView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ThemedText type="default" style={styles.backText}>← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.headerTitle}>PREFERENCES</ThemedText>
            <StepIndicator currentStep={3} totalSteps={4} />
          </View>
          <ThemedText type="default" style={styles.intro}>
            Choose your hobbies or what you like to do
          </ThemedText>
          <Card style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Add</ThemedText>
            <View style={styles.suggestionsWrap}>
              {SUGGESTIONS.map(s => {
                const selected = hobbies.includes(s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => selected ? removeHobby(s) : addHobby(s)}
                  >
                    <ThemedText style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {selected ? '✓ ' : ''}{s}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
          <Card style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Add your own</ThemedText>

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, inputErr ? styles.inputError : null]}
                placeholder="Type a hobby or interest..."
                placeholderTextColor={COLORS.textMuted}
                value={input}
                onChangeText={(t) => { setInput(t); setInputErr(''); }}
                returnKeyType="done"
                onSubmitEditing={() => addHobby()}
              />
              <TouchableOpacity
                style={[styles.addBtn, !input.trim() && styles.addBtnDisabled]}
                onPress={() => addHobby()}
                disabled={!input.trim()}
              >
                <ThemedText style={styles.addBtnText}>+</ThemedText>
              </TouchableOpacity>
            </View>

            {inputErr ? (
              <ThemedText type="error" style={styles.inputErrText}>{inputErr}</ThemedText>
            ) : null}
          </Card>
          {hobbies.length > 0 && (
            <Card style={styles.card}>
              <Animated.View style={{ opacity: shimmerAnim.interpolate({
                inputRange: [0, 1], outputRange: [1, 0.6]
              })}}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Your list ({hobbies.length})
                </ThemedText>
                <FlatList
                  data={hobbies}
                  keyExtractor={(item) => item}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.hobbyRow}>
                      <View style={styles.hobbyDot} />
                      <ThemedText type="default" style={styles.hobbyText}>{item}</ThemedText>
                      <TouchableOpacity onPress={() => removeHobby(item)} style={styles.removeBtn}>
                        <ThemedText style={styles.removeIcon}>✕</ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </Animated.View>
            </Card>
          )}
          <ThemedButton
            title="Create Account"
            onPress={handleFinish}
            loading={loading}
            disabled={hobbies.length < 1}
            size="large"
            style={styles.finishBtn}
          />
          <ThemedText type="caption" style={styles.minHint}>
            Add at least 1 hobby to continue
          </ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll:      { flexGrow: 1, padding: SPACING.lg },
  header:      { paddingTop: SPACING.lg, marginBottom: SPACING.md },
  backBtn:     { marginBottom: SPACING.sm },
  backText:    { color: COLORS.primary, fontSize: 16 },
  headerTitle: { textAlign: 'center', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.sm },
  intro:       { textAlign: 'center', color: COLORS.textSecondary, marginBottom: SPACING.lg },

  card:         { marginBottom: SPACING.lg },
  sectionTitle: { marginBottom: SPACING.md, color: COLORS.primary },

  suggestionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.xs + 2,
    borderRadius:      BORDER_RADIUS.full,
    borderWidth:       1.5,
    borderColor:       COLORS.border,
    backgroundColor:   COLORS.inputBg,
  },
  chipSelected:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText:         { color: COLORS.textSecondary, fontSize: 14 },
  chipTextSelected: { color: '#fff', fontWeight: '600' },

  inputRow:     { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  input: {
    flex:              1,
    height:            50,
    borderWidth:       1,
    borderColor:       COLORS.border,
    borderRadius:      BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    fontSize:          15,
    backgroundColor:   COLORS.inputBg,
    color:             COLORS.textPrimary,
  },
  inputError:     { borderColor: COLORS.errorBorder },
  inputErrText:   { marginTop: SPACING.xs },
  addBtn: {
    width:           50,
    height:          50,
    borderRadius:    BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  addBtnDisabled: { backgroundColor: COLORS.disabled },
  addBtnText:     { color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '400' },

  hobbyRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hobbyDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: COLORS.primary,
    marginRight:     SPACING.sm,
  },
  hobbyText:  { flex: 1 },
  removeBtn:  { padding: SPACING.xs },
  removeIcon: { color: COLORS.accentRed, fontSize: 16 },

  finishBtn: { width: '100%', marginBottom: SPACING.xs },
  minHint:   { textAlign: 'center' },
});