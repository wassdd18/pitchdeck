import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../../../components/ui/card';
import StepIndicator from '../../../components/ui/step-indicator';
import ThemedButton from '../../../components/ui/themed-button';
import { ThemedText } from '../../../components/ui/themed-text';
import { ThemedView } from '../../../components/ui/themed-view';
import { useRegistration } from '../../../contexts/registration-context';
import { COLORS, SPACING } from '../../../lib/theme';

function calcAge(dob) {
  if (!dob) return null;
  const d     = new Date(dob);
  const today = new Date();
  const age   = today.getFullYear() - d.getFullYear()
    - (today < new Date(today.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return age;
}

export default function RegisterProfile() {
  const { data, updateData } = useRegistration();
  const [profileImage, setProfileImage] = useState(data.profileImage ?? null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:       ImagePicker.MediaTypeOptions.Images,
      allowsEditing:    true,
      aspect:           [1, 1],
      quality:          0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    updateData({ profileImage });
    router.push('/(tabs)/register/hobbies');
  };

  const age = calcAge(data.dateOfBirth);

  return (
    <ThemedView>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ThemedText type="default" style={styles.backText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>PROFILE</ThemedText>
          <StepIndicator currentStep={2} totalSteps={4} />
        </View>

        <Card style={styles.card}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Profile Picture</ThemedText>

          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarWrap} activeOpacity={0.8}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarIcon}>👤</ThemedText>
                  <ThemedText type="small" style={styles.avatarHint}>Tap to select photo</ThemedText>
                </View>
              )}

              <View style={styles.editBadge}>
                <ThemedText style={styles.editBadgeIcon}>✏️</ThemedText>
              </View>
            </TouchableOpacity>

            {profileImage && (
              <TouchableOpacity onPress={() => setProfileImage(null)} style={styles.removeBtn}>
                <ThemedText type="small" style={styles.removeText}>Remove photo</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          <ThemedText type="caption" style={styles.note}>
            Photo is stored only on your device during this session and
            will be uploaded to your profile after registration.
          </ThemedText>
        </Card>

        <Card style={styles.card}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Profile Preview</ThemedText>

          <View style={styles.previewRow}>
            <View style={styles.previewAvatar}>
              {profileImage
                ? <Image source={{ uri: profileImage }} style={styles.previewAvatarImg} />
                : <ThemedText style={styles.previewAvatarIcon}>👤</ThemedText>}
            </View>

            <View style={styles.previewInfo}>
              <ThemedText type="subtitle" style={styles.previewName}>
                {[data.firstName, data.lastName].filter(Boolean).join(' ') || 'Your Name'}
              </ThemedText>
              <ThemedText type="small" style={styles.previewMeta}>
                {[age ? `${age} years old` : null, data.location].filter(Boolean).join(' · ')}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />
          <ThemedText type="default" style={styles.confirmLabel}>
            Is everything correct?
          </ThemedText>

          <View style={styles.detailsGrid}>
            <DetailRow label="First name"  value={data.firstName  || '—'} />
            <DetailRow label="Last name"   value={data.lastName   || '—'} />
            <DetailRow label="Email"       value={data.email      || '—'} />
            <DetailRow label="Age"         value={age ? `${age} years` : '—'} />
            <DetailRow label="Location"    value={data.location   || '—'} />
            <DetailRow label="Language"    value={data.language   || '—'} />
          </View>

          <ThemedButton
            title="Yes, looks good →"
            onPress={handleNext}
            size="large"
            style={styles.confirmBtn}
          />

          <ThemedButton
            title="Edit information"
            onPress={() => router.push('/(tabs)/register')}
            variant="outline"
            size="medium"
            style={styles.editBtn}
          />
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={detailStyles.row}>
      <ThemedText type="small"    style={detailStyles.label}>{label}</ThemedText>
      <ThemedText type="default"  style={detailStyles.value}>{value}</ThemedText>
    </View>
  );
}
const detailStyles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: COLORS.textSecondary, flex: 1 },
  value: { flex: 2, textAlign: 'right', fontWeight: '500', color: COLORS.textPrimary },
});

const styles = StyleSheet.create({
  scroll:      { flexGrow: 1, padding: SPACING.lg },
  header:      { paddingTop: SPACING.lg, marginBottom: SPACING.xl },
  backBtn:     { marginBottom: SPACING.sm },
  backText:    { color: COLORS.primary, fontSize: 16 },
  headerTitle: { textAlign: 'center', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.sm },

  card:         { marginBottom: SPACING.lg },
  sectionTitle: { marginBottom: SPACING.md, color: COLORS.primary },

  avatarSection: { alignItems: 'center', marginBottom: SPACING.md },
  avatarWrap: {
    position:     'relative',
    width:        120,
    height:       120,
    borderRadius: 60,
    overflow:     'visible',
    marginBottom: SPACING.sm,
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width:           120,
    height:          120,
    borderRadius:    60,
    backgroundColor: COLORS.primaryBg,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     COLORS.primaryLight,
    borderStyle:     'dashed',
  },
  avatarIcon: { fontSize: 44, marginBottom: SPACING.xs },
  avatarHint: { textAlign: 'center', fontSize: 11, color: COLORS.textMuted },
  editBadge: {
    position:        'absolute',
    bottom:          2,
    right:           2,
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     '#fff',
  },
  editBadgeIcon: { fontSize: 14 },
  removeBtn:     { marginTop: SPACING.xs },
  removeText:    { color: COLORS.accentRed },
  note:          { textAlign: 'center', marginTop: SPACING.sm },

  previewRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  SPACING.md,
  },
  previewAvatar: {
    width:           56,
    height:          56,
    borderRadius:    28,
    backgroundColor: COLORS.primaryBg,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     SPACING.md,
    overflow:        'hidden',
  },
  previewAvatarImg:  { width: 56, height: 56, borderRadius: 28 },
  previewAvatarIcon: { fontSize: 28 },
  previewInfo:       { flex: 1 },
  previewName:       { marginBottom: 2 },
  previewMeta:       { color: COLORS.textSecondary },

  divider: {
    height:          1,
    backgroundColor: COLORS.border,
    marginVertical:  SPACING.md,
  },
  confirmLabel: {
    fontWeight:   '600',
    marginBottom: SPACING.md,
    color:        COLORS.textPrimary,
  },
  detailsGrid: { marginBottom: SPACING.md },
  confirmBtn:  { width: '100%', marginBottom: SPACING.sm },
  editBtn:     { width: '100%' },
});