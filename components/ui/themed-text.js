import { StyleSheet, Text } from 'react-native';
import { COLORS, FONTS } from '../../lib/theme';
export function ThemedText({ type = 'default', style, children, ...props }) {
  return (
    <Text style={[styles.base, styles[type], style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color:      COLORS.textPrimary,
    fontFamily: FONTS.body,    
  },

  title: {
    fontSize:   28,
    fontWeight: '700',
    fontFamily: FONTS.heading,   
    color:      COLORS.textPrimary,
    lineHeight: 34,
  },

  subtitle: {
    fontSize:   18,
    fontWeight: '600',
    fontFamily: FONTS.heading,
    color:      COLORS.textPrimary,
    lineHeight: 24,
  },

  default: {
    fontSize:   15,
    fontWeight: '400',
    lineHeight: 22,
  },

  small: {
    fontSize:   13,
    fontWeight: '400',
    color:      COLORS.textSecondary,
  },

  caption: {
    fontSize:   11,
    color:      COLORS.textSecondary,
    fontStyle:  'italic',
    lineHeight: 16,
  },

  link: {
    fontSize:            15,
    color:               COLORS.primary,
    textDecorationLine:  'underline',
  },

  error: {
    fontSize: 13,
    color:    COLORS.error,
  },
});