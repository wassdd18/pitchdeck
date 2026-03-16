import { StyleSheet, View } from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../../lib/theme';

export default function Card({ style, children, ...props }) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius:    BORDER_RADIUS.lg,
    padding:         SPACING.lg,
    ...SHADOWS.card,
  },
});