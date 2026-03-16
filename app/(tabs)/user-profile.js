import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../../components/ui/bottom-nav';
import ThemedButton from '../../components/ui/themed-button';
import { ThemedText } from '../../components/ui/themed-text';
import { ThemedView } from '../../components/ui/themed-view';
import { useAuth } from '../../contexts/auth-context';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../../lib/theme';

export default function UserProfileScreen() {
  const { user, logout, loading } = useAuth();

  const [editModal, setEditModal] = useState(false);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const displayName = user?.name             ?? 'Your Name';
  const email       = user?.email            ?? '—';
  const location    = user?.prefs?.location  ?? '—';
  const language    = user?.prefs?.language  ?? '—';
  const hobbies     = user?.prefs?.hobbies   ?? [];
  const avatar      = user?.prefs?.profileImage ?? null;

  return (
    <ThemedView>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>Profile</ThemedText>
          <TouchableOpacity style={styles.editIconBtn} onPress={() => setEditModal(true)}>
            <ThemedText style={styles.editIcon}>✏️</ThemedText>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              {avatar
                ? <Image source={{ uri: avatar }} style={styles.avatar} />
                : (
                  <View style={styles.avatarPlaceholder}>
                    <ThemedText style={styles.avatarIcon}>👤</ThemedText>
                  </View>
                )
              }
              <TouchableOpacity style={styles.editBadge} onPress={() => setEditModal(true)}>
                <ThemedText style={styles.editBadgeIcon}>✏️</ThemedText>
              </TouchableOpacity>
            </View>
            <ThemedText type="subtitle" style={styles.displayName}>{displayName}</ThemedText>
          </View>

          <View style={styles.card}>
            <InfoRow icon="👤" label="Name"     value={displayName} />
            <InfoRow icon="🏙️" label="Location" value={location} />
            <InfoRow icon="✉️" label="E-Mail"   value={email} />
            <InfoRow icon="🌐" label="Language" value={language} last />
          </View>

          {hobbies.length > 0 && (
            <View style={styles.card}>
              <ThemedText style={styles.sectionTitle}>Hobbies & Interests</ThemedText>
              <View style={styles.hobbiesWrap}>
                {hobbies.map(h => (
                  <View key={h} style={styles.hobbyChip}>
                    <ThemedText style={styles.hobbyText}>{h}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          <ThemedButton
            title="Log Out"
            onPress={handleLogout}
            variant="danger"
            size="large"
            loading={loading}
            style={styles.logoutBtn}
          />

        </Animated.View>
      </ScrollView>

      <BottomNav />

      <EditModal
        visible={editModal}
        onClose={() => setEditModal(false)}
        user={user}
      />
    </ThemedView>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <View style={styles.infoIconWrap}>
        <ThemedText style={styles.infoIcon}>{icon}</ThemedText>
      </View>
      <View style={styles.infoContent}>
        <ThemedText style={styles.infoLabel}>{label}</ThemedText>
        <ThemedText style={styles.infoValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

function EditModal({ visible, onClose, user }) {
  const { updateProfile, loading } = useAuth();

  const [name,      setName]     = useState(user?.name            ?? '');
  const [location,  setLoc]      = useState(user?.prefs?.location ?? '');
  const [language,  setLang]     = useState(user?.prefs?.language ?? '');
  const [avatar,    setAvatar]   = useState(user?.prefs?.profileImage ?? null);

  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 500, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:    ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:        [1, 1],
      quality:       0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name,
        prefs: {
          ...(user?.prefs ?? {}),
          location,
          language,
          profileImage: avatar,
        },
      });
      onClose();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <TouchableOpacity style={modal.backdrop} onPress={onClose} />
        <Animated.View style={[modal.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={modal.handle} />

          <ThemedText type="subtitle" style={modal.title}>Edit Profile</ThemedText>

          <TouchableOpacity style={modal.avatarBtn} onPress={pickImage}>
            {avatar
              ? <Image source={{ uri: avatar }} style={modal.avatarImg} />
              : <View style={modal.avatarEmpty}><ThemedText style={{ fontSize: 36 }}>👤</ThemedText></View>
            }
            <View style={modal.avatarOverlay}>
              <ThemedText style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Change</ThemedText>
            </View>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <EditField label="Full Name"  value={name}     onChangeText={setName}    />
            <EditField label="Location"   value={location} onChangeText={setLoc}     />
            <EditField label="Language"   value={language} onChangeText={setLang}    />

            <ThemedButton
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              size="large"
              style={modal.saveBtn}
            />
            <ThemedButton
              title="Cancel"
              onPress={onClose}
              variant="ghost"
              size="medium"
              style={modal.cancelBtn}
            />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function EditField({ label, value, onChangeText, secureTextEntry }) {
  return (
    <View style={modal.field}>
      <ThemedText style={modal.fieldLabel}>{label}</ThemedText>
      <TextInput
        style={modal.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={COLORS.textMuted}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll:       { flexGrow: 1, paddingBottom: SPACING.xl },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingTop:        50,
    paddingHorizontal: SPACING.lg,
    paddingBottom:     SPACING.md,
  },
  headerTitle:  { color: COLORS.primary, letterSpacing: 2 },
  editIconBtn:  { padding: SPACING.sm },
  editIcon:     { fontSize: 20 },

  avatarSection: {
    alignItems:    'center',
    paddingVertical: SPACING.lg,
  },
  avatarWrap: {
    position:     'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width:        100,
    height:       100,
    borderRadius: 50,
    borderWidth:  3,
    borderColor:  COLORS.primaryLight,
  },
  avatarPlaceholder: {
    width:           100,
    height:          100,
    borderRadius:    50,
    backgroundColor: COLORS.primaryBg,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     3,
    borderColor:     COLORS.primaryLight,
  },
  avatarIcon:  { fontSize: 48 },
  editBadge: {
    position:        'absolute',
    bottom:          0,
    right:           0,
    width:           30,
    height:          30,
    borderRadius:    15,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     '#fff',
  },
  editBadgeIcon: { fontSize: 13 },
  displayName:   { color: COLORS.textPrimary },

  card: {
    backgroundColor:   '#FFFFFF',
    marginHorizontal:  SPACING.md,
    marginBottom:      SPACING.md,
    borderRadius:      BORDER_RADIUS.lg,
    borderWidth:       1,
    borderColor:       COLORS.border,
    overflow:          'hidden',
    ...SHADOWS.card,
  },
  infoRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.md,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoIconWrap: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: COLORS.primaryBg,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     SPACING.md,
  },
  infoIcon:    { fontSize: 18 },
  infoContent: { flex: 1 },
  infoLabel:   { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue:   { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500', marginTop: 1 },

  sectionTitle: { fontWeight: '600', color: COLORS.primary, padding: SPACING.md, paddingBottom: SPACING.sm },
  hobbiesWrap: {
    flexDirection:     'row',
    flexWrap:          'wrap',
    gap:               SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom:     SPACING.md,
  },
  hobbyChip: {
    backgroundColor:   COLORS.primaryBg,
    borderRadius:      BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical:   6,
    borderWidth:       1,
    borderColor:       COLORS.primaryLight,
  },
  hobbyText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },

  logoutBtn: { marginHorizontal: SPACING.md, marginTop: SPACING.sm },
});

const modal = StyleSheet.create({
  overlay:  { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor:   '#FFFFFF',
    borderTopLeftRadius:  BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding:           SPACING.lg,
    paddingBottom:     40,
    maxHeight:         '90%',
    ...SHADOWS.card,
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: COLORS.border,
    alignSelf:       'center',
    marginBottom:    SPACING.md,
  },
  title:   { textAlign: 'center', marginBottom: SPACING.lg, color: COLORS.primary },
  avatarBtn: {
    width:        80,
    height:       80,
    borderRadius: 40,
    overflow:     'hidden',
    alignSelf:    'center',
    marginBottom: SPACING.lg,
  },
  avatarImg:   { width: 80, height: 80 },
  avatarEmpty: {
    width:           80,
    height:          80,
    backgroundColor: COLORS.primaryBg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  avatarOverlay: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: 'rgba(69,64,168,0.7)',
    alignItems:      'center',
    paddingVertical: 4,
  },
  field:       { marginBottom: SPACING.md },
  fieldLabel: {
    fontSize:      11,
    fontWeight:    '700',
    color:         COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom:  4,
  },
  input: {
    height:            50,
    borderWidth:       1,
    borderColor:       COLORS.border,
    borderRadius:      BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    fontSize:          15,
    backgroundColor:   COLORS.inputBg,
    color:             COLORS.textPrimary,
  },
  saveBtn:   { width: '100%', marginBottom: SPACING.sm, marginTop: SPACING.md },
  cancelBtn: { width: '100%' },
});