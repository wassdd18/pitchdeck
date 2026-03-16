import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { loading, error, forgotPassword, clearError } = useAuth();

  const formOpacity = useRef(new Animated.Value(1)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.7)).current;

  const handleSend = async () => {
    if (!email.trim()) return;
    clearError();

    try {
      await forgotPassword(email.trim().toLowerCase());

      Animated.sequence([
        Animated.timing(formOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(successOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(successScale, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setSent(true);
    } catch (e) {
      console.log('Forgot password error:', e);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ThemedText type="default" style={styles.backText}>
                ← Back to Login
              </ThemedText>
            </TouchableOpacity>

            <ThemedText type="title" style={styles.headerTitle}>
              LOGIN
            </ThemedText>
          </View>

          {!sent && (
            <Animated.View style={{ opacity: formOpacity }}>
              <Card style={styles.card}>
                <Image
                  source={require('../../images/lock.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />

                <ThemedText type="subtitle" style={styles.cardTitle}>
                  Forgot your password?
                </ThemedText>

                <ThemedText type="default" style={styles.cardSubtitle}>
                  Enter your registered email below to receive a password reset link.
                </ThemedText>

                <ThemedText type="small" style={styles.label}>
                  Email Address
                </ThemedText>

                <TextInput
                  style={styles.input}
                  placeholder="Insert your email address"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {error ? (
                  <View style={styles.errorBox}>
                    <ThemedText type="error">⚠️ {error}</ThemedText>
                  </View>
                ) : null}

                <ThemedButton
                  title="Send"
                  onPress={handleSend}
                  loading={loading}
                  disabled={!email.trim()}
                  size="large"
                  style={styles.actionBtn}
                />
              </Card>

              <TouchableOpacity
                style={styles.rememberWrap}
                onPress={() => router.replace('/(tabs)/login')}
              >
                <ThemedText type="default" style={styles.rememberText}>
                  You remember your password?{' '}
                  <ThemedText type="link">Login</ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          )}

          {sent && (
            <Animated.View
              style={{
                opacity: successOpacity,
                transform: [{ scale: successScale }],
              }}
            >
              <Card style={styles.card}>
                <View style={styles.animPlaceholder}>
                  <ThemedText style={styles.placeholderIcon}>✉️</ThemedText>
                </View>

                <ThemedText type="subtitle" style={styles.cardTitle}>
                  Email sent!
                </ThemedText>

                <ThemedText type="default" style={styles.cardSubtitle}>
                  We've sent a password reset link to{'\n'}
                  <ThemedText type="default" style={styles.emailHighlight}>
                    {email}
                  </ThemedText>
                </ThemedText>

                <ThemedButton
                  title="Back to the main page"
                  onPress={() => router.replace('/(tabs)/login')}
                  size="large"
                  style={styles.actionBtn}
                />
              </Card>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  backBtn: {
    marginBottom: SPACING.md,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  headerTitle: {
    textAlign: 'center',
    color: COLORS.primary,
    letterSpacing: 3,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  animPlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  animView: {
    width: 150,
    height: 150,
  },
  placeholderIcon: {
    fontSize: 70,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  emailHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  label: {
    marginBottom: 4,
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    backgroundColor: COLORS.inputBg,
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  actionBtn: {
    width: '100%',
  },
  rememberWrap: {
    alignItems: 'center',
  },
  rememberText: {
    color: COLORS.textSecondary,
  },
});