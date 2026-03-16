import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../lib/theme';

export function ThemedView({ style, children, ...props }) {
  return (
    <View style={[styles.base, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});