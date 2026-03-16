import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS } from '../../lib/theme';
export default function ThemedButton({
  title,
  onPress,
  variant  = 'primary',
  size     = 'medium',
  loading  = false,
  disabled = false,
  style,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[`v_${variant}`],
        styles[`s_${size}`],
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && SHADOWS.button,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger'
            ? COLORS.textOnPrimary
            : COLORS.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.text, styles[`t_${variant}`], styles[`ts_${size}`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius:    BORDER_RADIUS.md,
    alignItems:      'center',
    justifyContent:  'center',
  },

  v_primary: { backgroundColor: COLORS.primary },
  v_outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  v_ghost:   { backgroundColor: 'transparent' },
  v_danger:  { backgroundColor: COLORS.error },

  s_small:  { height: 38, paddingHorizontal: 18 },
  s_medium: { height: 50, paddingHorizontal: 22 },
  s_large:  { height: 56, paddingHorizontal: 28 },

  disabled: { opacity: 0.42 },

  text: { fontWeight: '600', fontFamily: FONTS.medium },

  t_primary: { color: COLORS.textOnPrimary },
  t_outline: { color: COLORS.primary },
  t_ghost:   { color: COLORS.primary },
  t_danger:  { color: COLORS.textOnPrimary },

  ts_small:  { fontSize: 14 },
  ts_medium: { fontSize: 15 },
  ts_large:  { fontSize: 17 },
});