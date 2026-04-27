import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function DemoNotice() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="information-circle" size={18} color={COLORS.newTestament} style={{ marginRight: 8 }} />
      <Text style={styles.text} numberOfLines={2}>
        Mode démonstration — Ajoutez{' '}
        <Text style={styles.bold}>bible_fr.json</Text> dans{' '}
        <Text style={styles.bold}>data/</Text> pour la Bible complète.
      </Text>
      <TouchableOpacity onPress={() => setVisible(false)} style={styles.close}>
        <Ionicons name="close" size={16} color={COLORS.newTestament} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.newTestamentBg,
    borderWidth: 1,
    borderColor: COLORS.newTestamentBorder,
    borderRadius: SIZES.radius,
    padding: SIZES.s3,
    marginHorizontal: SIZES.s4,
    marginVertical: SIZES.s2,
  },
  text: {
    flex: 1,
    fontSize: SIZES.xs,
    color: COLORS.newTestament,
    lineHeight: 17,
  },
  bold: {
    fontWeight: '700',
  },
  close: {
    marginLeft: 8,
    padding: 2,
  },
});
