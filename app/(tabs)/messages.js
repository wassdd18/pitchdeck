import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../../components/ui/bottom-nav';
import { ThemedText } from '../../components/ui/themed-text';
import { ThemedView } from '../../components/ui/themed-view';
import { useAuth } from '../../contexts/auth-context';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../../lib/theme';

const MOCK_MESSAGES = [
  {
    id: '1',
    type:    'message',
    name:    'Amanda Jane',
    avatar:  '👩',
    preview: 'Hahahahaha',
    time:    '10:35 AM',
    unread:  1,
  },
  {
    id: '2',
    type:    'message',
    name:    'Lisa Roy',
    avatar:  '👦',
    preview: 'Hi, are you Available Tomorrow?',
    time:    '10:35 AM',
    unread:  3,
  },
  {
    id: '3',
    type:    'message',
    name:    'Jamie Taylor',
    avatar:  '🧔',
    preview: 'Nice One, Will Do it tomorrow',
    time:    '10:35 AM',
    unread:  0,
  },
];

const TABS = ['Messages', 'My Circles'];

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const tabAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const switchTab = (index) => {
    Animated.parallel([
      Animated.spring(tabAnim,  { toValue: index, friction: 8, useNativeDriver: false }),
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
    setActiveTab(index);
  };

  return (
    <ThemedView>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Messages</ThemedText>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => switchTab(i)}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
              {t}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {activeTab === 0
          ? <MessageList />
          : <CircleList />
        }
      </Animated.View>

      <BottomNav />
    </ThemedView>
  );
}

function MessageList() {
  return (
    <FlatList
      data={MOCK_MESSAGES}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => <MessageRow item={item} index={index} />}
    />
  );
}

function MessageRow({ item, index }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue:  1,
      duration: 350,
      delay:    index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{
      opacity:   anim,
      transform: [{ translateX: anim.interpolate({ inputRange: [0,1], outputRange: [-30, 0] }) }],
    }}>
      <TouchableOpacity style={styles.msgRow} activeOpacity={0.8}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarEmoji}>{item.avatar}</ThemedText>
        </View>

        <View style={styles.msgBody}>
          <View style={styles.msgTop}>
            <ThemedText style={styles.msgName}>{item.name}</ThemedText>
            <ThemedText style={styles.msgTime}>{item.time}</ThemedText>
          </View>
          <ThemedText style={styles.msgPreview} numberOfLines={1}>{item.preview}</ThemedText>
        </View>

        {item.unread > 0 && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{item.unread}</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function CircleList() {
  const { user } = useAuth();
  const joinedCircles = user?.prefs?.joinedCircles ?? [];

  if (joinedCircles.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <ThemedText style={styles.emptyIcon}>🏠</ThemedText>
        <ThemedText type="subtitle" style={styles.emptyTitle}>No circles yet</ThemedText>
        <ThemedText type="small" style={styles.emptySubtitle}>
          Join circles on the home page and they'll appear here
        </ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={joinedCircles}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => <EventCard item={item} index={index} />}
    />
  );
}

function EventCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue:  1,
      duration: 350,
      delay:    index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(expandAnim, { toValue, friction: 8, useNativeDriver: false }).start();
    setExpanded(v => !v);
  };

  const maxHeight = expandAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 120],
  });

  return (
    <Animated.View style={[
      styles.eventCard,
      {
        opacity:   slideAnim,
        transform: [{ translateY: slideAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }],
      },
    ]}>
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.9}>
        <View style={styles.eventHeader}>
          <View style={styles.eventDot} />
          <View style={styles.eventInfo}>
            <ThemedText style={styles.eventName}>{item.name}</ThemedText>
            <ThemedText style={styles.eventMeta}>
              🕐 {item.time}  ·  📍 {item.location}
            </ThemedText>
            <View style={styles.dateBadge}>
              <ThemedText style={styles.dateText}>{item.category}</ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.chevron, expanded && styles.chevronUp]}>›</ThemedText>
        </View>

        <Animated.View style={[styles.attendeesWrap, { maxHeight, overflow: 'hidden' }]}>
          <View style={styles.divider} />
          <ThemedText style={styles.attendeesLabel}>
            You joined this circle 🎉
          </ThemedText>
          <ThemedText style={styles.attendeesNote}>
            See you there! Check back for updates on attendees.
          </ThemedText>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop:        50,
    paddingHorizontal: SPACING.lg,
    paddingBottom:     SPACING.md,
    backgroundColor:   COLORS.background,
  },
  headerTitle: { color: COLORS.primary, letterSpacing: 2 },

  tabBar: {
    flexDirection:     'row',
    marginHorizontal:  SPACING.lg,
    marginBottom:      SPACING.md,
    backgroundColor:   COLORS.primaryBg,
    borderRadius:      BORDER_RADIUS.full,
    padding:           4,
  },
  tab: {
    flex:            1,
    paddingVertical: SPACING.sm,
    alignItems:      'center',
    borderRadius:    BORDER_RADIUS.full,
  },
  tabActive:     { backgroundColor: '#FFFFFF', ...SHADOWS.card },
  tabText:       { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary },

  content: { flex: 1 },
  list:    { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  emptyWrap: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        SPACING.xl,
    marginTop:      SPACING.xxl,
  },
  emptyIcon:     { fontSize: 56, marginBottom: SPACING.md },
  emptyTitle:    { marginBottom: SPACING.sm, color: COLORS.textPrimary },
  emptySubtitle: { textAlign: 'center', color: COLORS.textSecondary, lineHeight: 20 },

  msgRow: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#FFFFFF',
    borderRadius:    BORDER_RADIUS.lg,
    padding:         SPACING.md,
    marginBottom:    SPACING.sm,
    borderWidth:     1,
    borderColor:     COLORS.border,
    ...SHADOWS.card,
  },
  avatar: {
    width:           48,
    height:          48,
    borderRadius:    24,
    backgroundColor: COLORS.primaryBg,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     SPACING.md,
  },
  avatarEmoji: { fontSize: 26 },
  msgBody:     { flex: 1 },
  msgTop: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   2,
  },
  msgName:    { fontWeight: '700', fontSize: 15, color: COLORS.textPrimary },
  msgTime:    { fontSize: 11,  color: COLORS.textMuted },
  msgPreview: { fontSize: 13,  color: COLORS.textSecondary },
  badge: {
    backgroundColor:   COLORS.accentRed,
    borderRadius:      10,
    minWidth:          20,
    height:            20,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 5,
    marginLeft:        SPACING.sm,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius:    BORDER_RADIUS.lg,
    marginBottom:    SPACING.sm,
    borderWidth:     1,
    borderColor:     COLORS.border,
    overflow:        'hidden',
    ...SHADOWS.card,
  },
  eventHeader: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    padding:        SPACING.md,
  },
  eventDot: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: COLORS.primary,
    marginTop:       5,
    marginRight:     SPACING.sm,
  },
  eventInfo:  { flex: 1 },
  eventName:  { fontWeight: '700', fontSize: 15, color: COLORS.textPrimary, marginBottom: 4 },
  eventMeta:  { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  dateBadge: {
    backgroundColor:   COLORS.primaryBg,
    borderRadius:      BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical:   2,
    alignSelf:         'flex-start',
  },
  dateText:  { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  chevron:   { fontSize: 22, color: COLORS.textMuted, transform: [{ rotate: '90deg' }] },
  chevronUp: { transform: [{ rotate: '-90deg' }] },

  divider:        { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.sm },
  attendeesWrap:  { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  attendeesLabel: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  attendeesNote:  { fontSize: 12, color: COLORS.textSecondary },
});