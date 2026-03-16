import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../lib/theme';

export default function StepIndicator({ currentStep = 0, totalSteps = 4 }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View key={i} style={styles.step}>
          <View
            style={[
              styles.dot,
              i < currentStep  && styles.dotDone,
              i === currentStep && styles.dotActive,
            ]}
          />
          {i < totalSteps - 1 && (
            <View style={[styles.line, i < currentStep && styles.lineDone]} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  dot: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: '#D4D3F0',
  },
  dotActive: {
    width:           16,
    height:          16,
    borderRadius:    8,
    backgroundColor: COLORS.primary,
  },
  dotDone: {
    backgroundColor: COLORS.primaryLight,
  },
  line: {
    width:           28,
    height:          2,
    backgroundColor: '#D4D3F0',
  },
  lineDone: {
    backgroundColor: COLORS.primaryLight,
  },
});