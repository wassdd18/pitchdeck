import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { useRegistration } from '../../../contexts/registration-context';
import { BORDER_RADIUS, COLORS, SPACING } from '../../../lib/theme';

const LANGUAGES = ['English', 'Hebrew', 'Arabic'];
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{10,}$/;
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function calcAge(dob) {
  if (!dob) return 0;
  const today = new Date();
  return today.getFullYear() - dob.getFullYear()
    - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
}

export default function RegisterStep1() {
  const { data, updateData } = useRegistration();

  const [firstName,       setFirstName]       = useState(data.firstName);
  const [lastName,        setLastName]         = useState(data.lastName);
  const [email,           setEmail]            = useState(data.email);
  const [confirmEmail,    setConfirmEmail]     = useState(data.confirmEmail);
  const [password,        setPassword]         = useState(data.password);
  const [confirmPassword, setConfirmPassword]  = useState(data.confirmPassword);
  const [dateOfBirth,     setDateOfBirth]      = useState(data.dateOfBirth ?? null);
  const [language,        setLanguage]         = useState(data.language ?? 'English');

  const [showDatePicker,      setShowDatePicker]      = useState(false);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNext = () => {
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim().toLowerCase();
    const ce = confirmEmail.trim().toLowerCase();

    if (!fn || !ln || !em || !ce || !password || !confirmPassword || !dateOfBirth) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!EMAIL_RE.test(em)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    if (em !== ce) {
      Alert.alert('Emails don\'t match', 'Both email fields must be identical');
      return;
    }
    if (!PASSWORD_RE.test(password)) {
      Alert.alert('Weak Password',
        'Password must be at least 10 characters and contain at least one letter, one number, and one special character (!@#$%...)');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords don\'t match', 'Both password fields must be identical');
      return;
    }
    const age = calcAge(dateOfBirth);
    if (age < 6 || age > 120) {
      Alert.alert('Invalid Date', 'Please enter a realistic date of birth');
      return;
    }

    updateData({ firstName: fn, lastName: ln, email: em, confirmEmail: ce,
                 password, confirmPassword, dateOfBirth, language });
    router.push('/(tabs)/register/location');
  };

  const formatDate = (d) => d ? d.toLocaleDateString('en-GB') : null;

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
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
              <ThemedText type="default" style={styles.backText}>← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.headerTitle}>REGISTRATION</ThemedText>
            <StepIndicator currentStep={0} totalSteps={4} />
          </View>

          <Card style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>

            <ThemedText type="small" style={styles.label}>First Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Input First Name"
              placeholderTextColor={COLORS.textMuted}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <ThemedText type="small" style={styles.label}>Last Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Input Last Name"
              placeholderTextColor={COLORS.textMuted}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <ThemedText type="small" style={styles.label}>Email Address *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Input Email Address"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <ThemedText type="small" style={styles.label}>Confirm Email *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Confirm Email Address"
              placeholderTextColor={COLORS.textMuted}
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <ThemedText type="small" style={styles.label}>Date of Birth *</ThemedText>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText style={dateOfBirth ? styles.dateText : styles.datePlaceholder}>
                📅  {formatDate(dateOfBirth) ?? 'Select Date of Birth'}
              </ThemedText>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth ?? new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                onChange={(_, selected) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selected) setDateOfBirth(selected);
                }}
              />
            )}
          </Card>

          <Card style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Security</ThemedText>

            <ThemedText type="small" style={styles.label}>Password *</ThemedText>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Type in Password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(v => !v)}
              >
                <ThemedText style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText type="small" style={styles.label}>Confirm Password *</ThemedText>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirmPassword(v => !v)}
              >
                <ThemedText style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁'}</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText type="caption" style={styles.hint}>
              Password must be at least 10 characters and contain at least one letter,
              one number, and one special character (!@#$%^&*...)
            </ThemedText>
          </Card>

          <Card style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              What language do you prefer?
            </ThemedText>
            <View style={styles.langRow}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.langChip, language === lang && styles.langChipActive]}
                  onPress={() => setLanguage(lang)}
                >
                  <ThemedText
                    type="default"
                    style={[styles.langText, language === lang && styles.langTextActive]}
                  >
                    {lang}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <ThemedButton
            title="Next"
            onPress={handleNext}
            size="large"
            style={styles.nextBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll:      { flexGrow: 1, padding: SPACING.lg },
  header:      { paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  backBtn:     { marginBottom: SPACING.sm },
  backText:    { color: COLORS.primary, fontSize: 16 },
  headerTitle: { textAlign: 'center', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.sm },

  card:         { marginBottom: SPACING.lg },
  sectionTitle: { marginBottom: SPACING.md, color: COLORS.primary },
  hint:         { marginTop: SPACING.xs, lineHeight: 16 },

  label: {
    marginBottom:  4,
    color:         COLORS.textSecondary,
    fontSize:      11,
    fontWeight:    '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    height:            50,
    borderWidth:       1,
    borderColor:       COLORS.border,
    borderRadius:      BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    fontSize:          15,
    backgroundColor:   COLORS.inputBg,
    marginBottom:      SPACING.md,
    color:             COLORS.textPrimary,
  },
  dateBtn: {
    height:            50,
    borderWidth:       1,
    borderColor:       COLORS.border,
    borderRadius:      BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    marginBottom:      SPACING.md,
    backgroundColor:   COLORS.inputBg,
    justifyContent:    'center',
  },
  dateText:        { color: COLORS.textPrimary, fontSize: 15 },
  datePlaceholder: { color: COLORS.textMuted,   fontSize: 15 },

  passwordRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  passwordInput: { flex: 1, marginBottom: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  eyeBtn: {
    height:                  50,
    width:                   50,
    borderWidth:              1,
    borderLeftWidth:          0,
    borderColor:              COLORS.border,
    borderTopRightRadius:     BORDER_RADIUS.sm,
    borderBottomRightRadius:  BORDER_RADIUS.sm,
    alignItems:               'center',
    justifyContent:           'center',
    backgroundColor:          COLORS.inputBg,
  },
  eyeIcon: { fontSize: 18 },

  langRow:        { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  langChip:       { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xs + 2, borderRadius: BORDER_RADIUS.full, borderWidth: 1.5, borderColor: COLORS.primary },
  langChipActive: { backgroundColor: COLORS.primary },
  langText:       { color: COLORS.primary, fontWeight: '600' },
  langTextActive: { color: '#fff' },

  nextBtn: { width: '100%', marginBottom: SPACING.xl },
});