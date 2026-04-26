import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IconName;
  nameActive: IconName;
  label: string;
  focused: boolean;
}

function TabIcon({ name, nameActive, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={focused ? nameActive : name}
        size={24}
        color={focused ? COLORS.tabActive : COLORS.tabInactive}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {/* 1. Accueil */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="home-outline"
              nameActive="home"
              label="Accueil"
              focused={focused}
            />
          ),
        }}
      />

      {/* 2. Lecture */}
      <Tabs.Screen
        name="read"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="book-outline"
              nameActive="book"
              label="Lecture"
              focused={focused}
            />
          ),
        }}
      />

      {/* 3. Recherche */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="search-outline"
              nameActive="search"
              label="Recherche"
              focused={focused}
            />
          ),
        }}
      />

      {/* 4. Livres */}
      <Tabs.Screen
        name="books"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="library-outline"
              nameActive="library"
              label="Livres"
              focused={focused}
            />
          ),
        }}
      />

      {/* 5. Favoris */}
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="heart-outline"
              nameActive="heart"
              label="Favoris"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.tabBg,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.tabInactive,
    fontWeight: '500',
    marginTop: 1,
  },
  tabLabelActive: {
    color: COLORS.tabActive,
    fontWeight: '700',
  },
});
