import { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');

const PRIMARY = '#6C5CE7';
const PRIMARY_DARK = '#4C3FCB';
const INK = '#1A1A2E';
const MUTED = '#6B7280';

const FEATURES = [
  {
    icon: 'school-outline' as const,
    title: 'Teach a Skill',
    desc: 'Share what you know — coding, design, languages — and earn credits.',
  },
  {
    icon: 'compass-outline' as const,
    title: 'Discover & Learn',
    desc: 'Browse skills from students around campus and book a session.',
  },
  {
    icon: 'wallet-outline' as const,
    title: 'Time Credits',
    desc: 'No money changes hands — your teaching hours become your learning hours.',
  },
];

const STATS = [
  { label: 'Skills Listed', value: '120+' },
  { label: 'Active Students', value: '850+' },
  { label: 'Avg. Rating', value: '4.8' },
];

export default function HomeScreen() {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <LinearGradient
        colors={[PRIMARY, PRIMARY_DARK]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroTopRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="infinite" size={22} color="#fff" />
            </View>
            <ThemedText style={styles.brand}>LearnLoop</ThemedText>
          </View>

          <View style={styles.heroBody}>
            <ThemedText style={styles.heroTitle}>
              Trade skills.{'\n'}Not tuition.
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              LearnLoop is a peer-to-peer skill exchange for campus — teach
              what you're great at, learn what you're not, and pay it
              forward with time instead of money.
            </ThemedText>

            <Link href="/(tabs)" asChild>
              <Pressable
                onPressIn={pressIn}
                onPressOut={pressOut}
                style={({ pressed }) => [styles.ctaWrap, pressed && { opacity: 0.9 }]}>
                <Animated.View style={[styles.cta, { transform: [{ scale }] }]}>
                  <ThemedText style={styles.ctaText}>Get Started</ThemedText>
                  <Ionicons name="arrow-forward" size={18} color={PRIMARY_DARK} />
                </Animated.View>
              </Pressable>
            </Link>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Stats strip, overlapping hero */}
      <View style={styles.statsCard}>
        {STATS.map((s, i) => (
          <View key={s.label} style={styles.statItem}>
            <ThemedText style={styles.statValue}>{s.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
            {i < STATS.length - 1 && <View style={styles.statDivider} />}
          </View>
        ))}
      </View>

      {/* Feature list */}
      <View style={styles.body}>
        <ThemedText style={styles.sectionTitle}>How it works</ThemedText>

        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={22} color={PRIMARY} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.featureTitle}>{f.title}</ThemedText>
              <ThemedText style={styles.featureDesc}>{f.desc}</ThemedText>
            </View>
          </View>
        ))}

        <Link href="/(tabs)" asChild>
          <Pressable style={styles.secondaryCta}>
            <ThemedText style={styles.secondaryCtaText}>Browse skills on campus</ThemedText>
            <Ionicons name="chevron-forward" size={18} color={PRIMARY} />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 56,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Platform.OS === 'android' ? 12 : 4,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  heroBody: {
    marginTop: 28,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.85)',
    maxWidth: width * 0.85,
  },
  ctaWrap: {
    marginTop: 24,
    alignSelf: 'flex-start',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaText: {
    color: PRIMARY_DARK,
    fontWeight: '700',
    fontSize: 15,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -34,
    borderRadius: 18,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: INK,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: MUTED,
  },
  statDivider: {
    position: 'absolute',
    right: 0,
    top: 4,
    bottom: 4,
    width: 1,
    backgroundColor: '#EDEDF3',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: INK,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFEDFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: INK,
  },
  featureDesc: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },
  secondaryCta: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  secondaryCtaText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 14,
  },
});