import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../../components/ui/card';
import ThemedButton from '../../components/ui/themed-button';
import { ThemedText } from '../../components/ui/themed-text';
import { ThemedView } from '../../components/ui/themed-view';
import { useAuth } from '../../contexts/auth-context';
import { BORDER_RADIUS, COLORS, SPACING } from '../../lib/theme';

export default function LoginScreen() {
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, login, clearError } = useAuth();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    clearError();
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/(tabs)/success?type=login');
    } catch {
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
            <ThemedText type="title" style={styles.headerTitle}>LOGIN</ThemedText>
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Card style={styles.card}>

              <ThemedText type="small" style={styles.label}>Email Address</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Insert Email Address"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <ThemedText type="small" style={styles.label}>Password</ThemedText>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Insert Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(v => !v)}
                >
                  <ThemedText style={styles.eyeIcon}>
                    {showPassword ? '🙈' : '👁'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <ThemedText type="error">⚠️  {error}</ThemedText>
                </View>
              ) : null}

            </Card>

            <ThemedButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              disabled={!email.trim() || !password.trim()}
              size="large"
              style={styles.loginBtn}
            />

            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => router.push('/(tabs)/forgot-password')}
            >
              <ThemedText type="link" style={styles.forgotText}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.lg },

  header:      { paddingTop: SPACING.lg, marginBottom: SPACING.xl },
  backBtn:     { marginBottom: SPACING.md },
  backText:    { color: COLORS.primary, fontSize: 16 },
  headerTitle: { textAlign: 'center', color: COLORS.primary, letterSpacing: 3 },

  card: { marginBottom: SPACING.lg },

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

  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderRadius:    BORDER_RADIUS.sm,
    padding:         SPACING.sm,
    borderWidth:     1,
    borderColor:     COLORS.errorBorder,
  },

  loginBtn:   { width: '100%', marginBottom: SPACING.lg },
  forgotWrap: { alignItems: 'center' },
  forgotText: { fontSize: 15 },
});