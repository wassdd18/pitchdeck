import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import ThemedButton from '../../components/ui/themed-button';
import { ThemedText } from '../../components/ui/themed-text';
import { COLORS, SPACING } from '../../lib/theme';

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }] }]}>
        <Image
          source={require('../../images/Logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <ThemedText type="title" style={styles.appName}>
          BICONNECT
        </ThemedText>

        <ThemedText type="default" style={styles.tagline}>
          Connect · Learn · Grow
        </ThemedText>

        <View style={styles.buttons}>
          <ThemedButton
            title="Register"
            onPress={() => router.push('/(tabs)/register')}
            variant="primary"
            size="large"
            style={styles.btn}
          />
          <ThemedButton
            title="Sign In"
            onPress={() => router.push('/(tabs)/login')}
            variant="outline"
            size="large"
            style={styles.btn}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    overflow: 'hidden',
  },
  bgCircleTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primaryBg,
    opacity: 0.7,
  },
  bgCircleBottom: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primaryBg,
    opacity: 0.5,
  },
  logoWrap: {
    width: 200,
    height: 200,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  appName: {
    fontSize: 34,
    color: COLORS.primary,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 15,
    letterSpacing: 1,
    marginBottom: SPACING.xxl,
  },
  buttons: {
    width: '100%',
    gap: SPACING.md,
  },
  btn: {
    width: '100%',
  },
});