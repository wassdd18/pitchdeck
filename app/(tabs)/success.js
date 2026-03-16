// ─────────────────────────────────────────────────────────
//  app/(tabs)/success.js
// ─────────────────────────────────────────────────────────
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import ThemedButton from '../../components/ui/themed-button';
import { ThemedText } from '../../components/ui/themed-text';
import { ThemedView } from '../../components/ui/themed-view';
import { COLORS, SPACING } from '../../lib/theme';

const CONTENT = {
  login: {
    title:       'You were successfully\nlogged in!',
    subtitle:    'Only one click to explore our app',
    buttonLabel: 'Next',
    destination: '/(tabs)/home',
  },
  register: {
    title:       'Your account was\nsuccessfully created!',
    subtitle:    'Only one click to explore our app',
    buttonLabel: 'Next',
    destination: '/(tabs)/home',
  },
};

export default function SuccessScreen() {
  const { type = 'login' } = useLocalSearchParams();
  const { title, subtitle, buttonLabel, destination } = CONTENT[type] ?? CONTENT.login;

  const checkScale = useRef(new Animated.Value(0)).current;
  const ringScale  = useRef(new Animated.Value(0)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(ringScale,  { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
      Animated.spring(checkScale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
      Animated.timing(fadeAnim,   { toValue: 1, duration: 400,            useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ThemedView>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }] }]} />
          <Animated.View style={[styles.circle, { transform: [{ scale: checkScale }] }]}>
            <ThemedText style={styles.checkMark}>✓</ThemedText>
          </Animated.View>
        </View>

        <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
          <ThemedText type="title"   style={styles.title}>{title}</ThemedText>
          <ThemedText type="default" style={styles.subtitle}>{subtitle}</ThemedText>
          <ThemedButton
            title={buttonLabel}
            onPress={() => router.replace(destination)}
            size="large"
            style={styles.btn}
          />
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl,
  },
  iconWrap: {
    width: 120, height: 120, marginBottom: SPACING.xl, alignItems: 'center', justifyContent: 'center',
  },
  ring: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, borderColor: COLORS.primaryLight, opacity: 0.4,
  },
  circle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 18, elevation: 10,
  },
  checkMark: { fontSize: 44, color: '#fff', lineHeight: 52 },
  textBlock: { width: '100%', alignItems: 'center' },
  title:     { textAlign: 'center', marginBottom: SPACING.sm, lineHeight: 38 },
  subtitle:  { textAlign: 'center', color: COLORS.textSecondary, marginBottom: SPACING.xl },
  btn:       { width: '100%' },
});