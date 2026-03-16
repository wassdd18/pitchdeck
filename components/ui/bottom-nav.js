// ─────────────────────────────────────────────────────────
//  components/ui/bottom-nav.js
// ─────────────────────────────────────────────────────────
import { router, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../../lib/theme';

const TABS = [
  { key: 'home',         icon: '🏠', route: '/(tabs)/home' },
  { key: 'messages',     icon: '✉️',  route: '/(tabs)/messages' },
  { key: 'user-profile', icon: '👤', route: '/(tabs)/user-profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = pathname.includes(tab.key);
        return <TabButton key={tab.key} tab={tab} isActive={isActive} />;
      })}
    </View>
  );
}

function TabButton({ tab, isActive }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dotAnim   = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(dotAnim, {
      toValue:  isActive ? 1 : 0,
      friction: 6,
      tension:  80,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8,  duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4,       useNativeDriver: true }),
    ]).start();
    router.push(tab.route);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.tabBtn} activeOpacity={0.7}>
      <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.icon, { color: isActive ? COLORS.accentRed : COLORS.primary }]}>
          {tab.icon}
        </Text>
      </Animated.View>

      {/* Активная точка снизу */}
      <Animated.View
        style={[
          styles.dot,
          {
            transform: [{ scale: dotAnim }],
            opacity:   dotAnim,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:    'row',
    backgroundColor:  '#FFFFFF',
    borderTopWidth:   1,
    borderTopColor:   COLORS.border,
    paddingBottom:    20,
    paddingTop:       10,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.card,
  },
  tabBtn: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  iconWrap: {
    width:           44,
    height:          44,
    borderRadius:    BORDER_RADIUS.md,
    alignItems:      'center',
    justifyContent:  'center',
  },
  icon: { fontSize: 22 },
  dot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: COLORS.accentRed,
    marginTop:       4,
  },
});