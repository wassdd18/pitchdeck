import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import BottomNav from '../../components/ui/bottom-nav';
import { ThemedText } from '../../components/ui/themed-text';
import { useAuth } from '../../contexts/auth-context';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../../lib/theme';
const MOCK_CIRCLES = [
  { id: '1', name: 'Chess Club',       time: '12:00 - 13:00', location: 'Community Center', lat: null, lng: null, category: 'Chess'       },
  { id: '2', name: 'Book Readers',     time: '14:00 - 15:30', location: 'City Library',     lat: null, lng: null, category: 'Reading'     },
  { id: '3', name: 'Yoga Morning',     time: '08:00 - 09:00', location: 'Riverside Park',   lat: null, lng: null, category: 'Yoga'        },
  { id: '4', name: 'Photography Walk', time: '10:00 - 12:00', location: 'Old Town',         lat: null, lng: null, category: 'Photography' },
  { id: '5', name: 'Coding Meetup',    time: '18:00 - 20:00', location: 'Co-Work Space',    lat: null, lng: null, category: 'Coding'      },
  { id: '6', name: 'Hiking Group',     time: '09:00 - 13:00', location: 'North Trail',      lat: null, lng: null, category: 'Hiking'      },
];

export default function HomeScreen() {
  const { user, toggleJoinedCircle } = useAuth();
  const [region,      setRegion]      = useState(null);
  const [search,      setSearch]      = useState('');
  const [circles,     setCircles]     = useState(MOCK_CIRCLES);
  const [filtered,    setFiltered]    = useState(MOCK_CIRCLES);
  const [locationErr, setLocationErr] = useState(false);

  const mapRef      = useRef(null);
  const headerAnim  = useRef(new Animated.Value(-60)).current;
  const listAnim    = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocationErr(true); return; }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const r = {
        latitude:       loc.coords.latitude,
        longitude:      loc.coords.longitude,
        latitudeDelta:  0.03,
        longitudeDelta: 0.03,
      };
      setRegion(r);
    })();
  }, []);
  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, { toValue: 0, friction: 8,                useNativeDriver: true }),
      Animated.timing(listAnim,   { toValue: 1, duration: 600, delay: 300,  useNativeDriver: true }),
    ]).start();
  }, []);
  const handleSearch = useCallback((text) => {
    setSearch(text);
    if (!text.trim()) { setFiltered(circles); return; }
    const q = text.toLowerCase();
    setFiltered(circles.filter(c =>
      c.name.toLowerCase().includes(q)     ||
      c.location.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    ));
  }, [circles]);
  const joinedIds   = (user?.prefs?.joinedCircles ?? []).map(c => c.id);
  const userHobbies = user?.prefs?.hobbies ?? [];
  const recommended = userHobbies.length > 0
    ? filtered.filter(c => userHobbies.includes(c.category))
    : filtered;
  const others      = filtered.filter(c => !recommended.includes(c));
  const displayList = [...recommended, ...others];

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        {region ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
              <View style={styles.myMarker}>
                <ThemedText style={styles.myMarkerText}>📍</ThemedText>
              </View>
            </Marker>

            {displayList.map(c => c.lat && (
              <Marker
                key={c.id}
                coordinate={{ latitude: c.lat, longitude: c.lng }}
                title={c.name}
                description={`${c.time} · ${c.location}`}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.mapLoader}>
            {locationErr
              ? <ThemedText type="small" style={{ textAlign: 'center', color: COLORS.textMuted }}>
                  Location permission denied.{'\n'}Enable in settings to see the map.
                </ThemedText>
              : <ActivityIndicator color={COLORS.primary} size="large" />
            }
          </View>
        )}
      </View>

      <Animated.View style={[styles.searchRow, { transform: [{ translateY: headerAnim }] }]}>
        <View style={styles.searchBox}>
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search circles, places..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <ThemedText style={styles.clearIcon}>✕</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <Animated.View style={[styles.listWrap, { opacity: listAnim }]}>
        <FlatList
          data={displayList}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <ThemedText type="small" style={styles.emptyText}>No circles found</ThemedText>
          }
          renderItem={({ item, index }) => (
            <CircleCard
              item={item}
              index={index}
              isRecommended={recommended.includes(item)}
              isJoined={joinedIds.includes(item.id)}
              onToggle={() => toggleJoinedCircle(item)}
            />
          )}
        />
      </Animated.View>

      <BottomNav />
    </View>
  );
}

function CircleCard({ item, index, isRecommended, isJoined, onToggle }) {
  const anim    = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue:  1,
      duration: 400,
      delay:    index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleJoin = () => {
    Animated.sequence([
      Animated.timing(btnAnim, { toValue: 0.88, duration: 100, useNativeDriver: true }),
      Animated.spring(btnAnim, { toValue: 1, friction: 4,       useNativeDriver: true }),
    ]).start(() => onToggle());
  };

  return (
    <Animated.View
      style={[
        styles.card,
        isRecommended && styles.cardRecommended,
        {
          opacity:   anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        },
      ]}
    >
      {isRecommended && (
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>⭐ For you</ThemedText>
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardInfo}>
          <ThemedText style={styles.cardLocation}>📍 {item.location}</ThemedText>
          <ThemedText style={styles.cardName}>{item.name}</ThemedText>
          <ThemedText style={styles.cardTime}>🕐 {item.time}</ThemedText>
        </View>

        <Animated.View style={{ transform: [{ scale: btnAnim }] }}>
          <TouchableOpacity
            style={[styles.joinBtn, isJoined && styles.joinBtnActive]}
            onPress={handleJoin}
            activeOpacity={0.85}
          >
            <ThemedText style={[styles.joinText, isJoined && styles.joinTextActive]}>
              {isJoined ? '✓ Joined' : 'JOIN'}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background },

  mapWrap:    { height: 280 },
  map:        { width: '100%', height: '100%' },
  mapLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryBg,
  },
  myMarker:     { padding: 4 },
  myMarkerText: { fontSize: 28 },

  searchRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    backgroundColor:   COLORS.background,
  },
  searchBox: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   '#FFFFFF',
    borderRadius:      BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    height:            46,
    borderWidth:       1,
    borderColor:       COLORS.border,
    ...SHADOWS.card,
  },
  searchIcon:  { fontSize: 16, marginRight: SPACING.xs },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  clearIcon:   { fontSize: 14, color: COLORS.textMuted, padding: 4 },

  listWrap: { flex: 1 },
  list:     { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  emptyText:{ textAlign: 'center', marginTop: SPACING.xl },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius:    BORDER_RADIUS.lg,
    marginBottom:    SPACING.sm,
    overflow:        'hidden',
    borderWidth:     1,
    borderColor:     COLORS.border,
    ...SHADOWS.card,
  },
  cardRecommended: {
    borderColor: COLORS.primaryLight,
    borderWidth: 1.5,
  },
  badge: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: SPACING.md,
    paddingVertical:   4,
  },
  badgeText:    { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  cardBody: {
    flexDirection:  'row',
    alignItems:     'center',
    padding:        SPACING.md,
  },
  cardInfo:     { flex: 1 },
  cardLocation: { fontSize: 11, color: COLORS.textMuted,      marginBottom: 2 },
  cardName:     { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  cardTime:     { fontSize: 12, color: COLORS.textSecondary },

  joinBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    BORDER_RADIUS.full,
    paddingVertical:   10,
    paddingHorizontal: 20,
    minWidth:          80,
    alignItems:        'center',
  },
  joinBtnActive: { backgroundColor: COLORS.success },
  joinText:      { color: '#fff', fontWeight: '700', fontSize: 13 },
  joinTextActive:{ color: '#fff' },
});