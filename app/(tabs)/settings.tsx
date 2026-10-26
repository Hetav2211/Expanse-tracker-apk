// ===== Apple HIG Settings Screen =====
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme';
import { Card } from '../../src/components/Card';
import { exportExpensesToCsv } from '../../src/utils/export';
import { exportDatabaseBackup, importDatabaseBackup } from '../../src/utils/backup';
import {
  Moon,
  Sun,
  Smartphone,
  Tag,
  Target,
  FileSpreadsheet,
  Download,
  Upload,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import {
  triggerMediumImpact,
  triggerSelection,
  isHapticsEnabled,
  setHapticsEnabled,
} from '../../src/utils/haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingBackup, setExportingBackup] = useState(false);
  const [importingBackup, setImportingBackup] = useState(false);
  const [hapticsOn, setHapticsOn] = useState(isHapticsEnabled());

  const handleExportCsv = async () => {
    try {
      triggerMediumImpact();
      setExportingCsv(true);
      await exportExpensesToCsv();
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export expenses to CSV.');
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      triggerMediumImpact();
      setExportingBackup(true);
      await exportDatabaseBackup();
    } catch (e) {
      Alert.alert('Backup Failed', 'Could not export database backup.');
    } finally {
      setExportingBackup(false);
    }
  };

  const handleImportBackup = async () => {
    try {
      triggerMediumImpact();
      setImportingBackup(true);
      const res = await importDatabaseBackup();
      if (res.success) {
        Alert.alert('Backup Restored', res.message);
      } else if (res.message !== 'File selection cancelled') {
        Alert.alert('Restore Failed', res.message);
      }
    } catch (e) {
      Alert.alert('Restore Error', 'An error occurred while importing backup.');
    } finally {
      setImportingBackup(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Apple Large Title Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
        <Text style={[typography.caption2, { color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
          Preferences
        </Text>
        <Text style={[typography.title1, { color: colors.textPrimary }]}>
          Settings
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.lg }]}
      >
        {/* Appearance Section */}
        <View>
          <Text style={[styles.sectionTitle, typography.footnote, { color: colors.textSecondary }]}>
            APPEARANCE
          </Text>
          <Card variant="default" padding="sm">
            <View
              style={[
                styles.themeSegmentControl,
                {
                  backgroundColor: colors.surfaceInset,
                  borderRadius: br.md,
                  padding: 3,
                },
              ]}
            >
              {[
                { mode: 'system', label: 'System', icon: Smartphone },
                { mode: 'light', label: 'Light', icon: Sun },
                { mode: 'dark', label: 'Dark', icon: Moon },
              ].map(({ mode, label, icon: Icon }) => {
                const isSelected = themeMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => {
                      triggerSelection();
                      setThemeMode(mode as any);
                    }}
                    activeOpacity={0.7}
                    style={[
                      styles.themeBtn,
                      {
                        backgroundColor: isSelected ? colors.surface : 'transparent',
                        borderRadius: br.sm,
                        shadowColor: isDark ? 'transparent' : '#000000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: isSelected && !isDark ? 0.08 : 0,
                        shadowRadius: 2,
                        elevation: isSelected && !isDark ? 1 : 0,
                      },
                    ]}
                  >
                    <Icon size={16} color={isSelected ? colors.primary : colors.textTertiary} />
                    <Text
                      style={[
                        typography.caption2,
                        {
                          color: isSelected ? colors.textPrimary : colors.textTertiary,
                          fontWeight: isSelected ? '600' : '400',
                          marginTop: 3,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Device Preferences */}
        <View>
          <Text style={[styles.sectionTitle, typography.footnote, { color: colors.textSecondary }]}>
            PREFERENCES
          </Text>
          <Card variant="default" padding="none">
            <View style={[styles.navItem, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
              <View
                style={[
                  styles.navIconBox,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: br.xs,
                  },
                ]}
              >
                <Smartphone size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <Text style={[typography.body, { color: colors.textPrimary }]}>
                  Haptic Feedback
                </Text>
              </View>
              <Switch
                value={hapticsOn}
                onValueChange={(val) => {
                  setHapticsOn(val);
                  setHapticsEnabled(val);
                }}
                trackColor={{ false: colors.surfaceInset, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        </View>

        {/* Configuration Management */}
        <View>
          <Text style={[styles.sectionTitle, typography.footnote, { color: colors.textSecondary }]}>
            CONFIGURATION
          </Text>
          <Card variant="default" padding="none">
            <TouchableOpacity
              onPress={() => router.push('/categories')}
              activeOpacity={0.6}
              style={[styles.navItem, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
            >
              <View
                style={[
                  styles.navIconBox,
                  {
                    backgroundColor: colors.warning,
                    borderRadius: br.xs,
                  },
                ]}
              >
                <Tag size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <Text style={[typography.body, { color: colors.textPrimary }]}>
                  Categories
                </Text>
              </View>
              <ChevronRight size={17} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: colors.separator, marginLeft: 28 + spacing.md + spacing.sm }]} />

            <TouchableOpacity
              onPress={() => router.push('/budgets')}
              activeOpacity={0.6}
              style={[styles.navItem, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
            >
              <View
                style={[
                  styles.navIconBox,
                  {
                    backgroundColor: colors.success,
                    borderRadius: br.xs,
                  },
                ]}
              >
                <Target size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <Text style={[typography.body, { color: colors.textPrimary }]}>
                  Monthly Budgets
                </Text>
              </View>
              <ChevronRight size={17} color={colors.textTertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Data & Backup */}
        <View>
          <Text style={[styles.sectionTitle, typography.footnote, { color: colors.textSecondary }]}>
            DATA & BACKUP
          </Text>
          <Card variant="default" padding="none">
            <TouchableOpacity
              onPress={handleExportCsv}
              disabled={exportingCsv}
              activeOpacity={0.6}
              style={[styles.navItem, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
            >
              <View
                style={[
                  styles.navIconBox,
                  {
                    backgroundColor: colors.success,
                    borderRadius: br.xs,
                  },
                ]}
              >
                <FileSpreadsheet size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <Text style={[typography.body, { color: colors.textPrimary }]}>
                  Export to CSV
                </Text>
              </View>
              {exportingCsv ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <ChevronRight size={17} color={colors.textTertiary} />
              )}
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: colors.separator, marginLeft: 28 + spacing.md + spacing.sm }]} />

            <TouchableOpacity
              onPress={handleExportBackup}
              disabled={exportingBackup}
              activeOpacity={0.6}
              style={[styles.navItem, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
            >
              <View
                style={[
                  styles.navIconBox,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: br.xs,
                  },
                ]}
              >
                <Download size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <Text style={[typography.body, { color: colors.textPrimary }]}>
                  Export Full Backup
                </Text>
              </View>
              {exportingBackup ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <ChevronRight size={17} color={colors.textTertiary} />
              )}
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: colors.separator, marginLeft: 28 + spacing.md + spacing.sm }]} />

            <TouchableOpacity
              onPress={handleImportBackup}
              disabled={importingBackup}
              activeOpacity={0.6}
              style={[styles.navItem, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
            >
              <View
                style={[
                  styles.navIconBox,
                  {
                    backgroundColor: colors.danger,
                    borderRadius: br.xs,
                  },
                ]}
              >
                <Upload size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <Text style={[typography.body, { color: colors.textPrimary }]}>
                  Restore Backup
                </Text>
              </View>
              {importingBackup ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <ChevronRight size={17} color={colors.textTertiary} />
              )}
            </TouchableOpacity>
          </Card>
        </View>

        {/* Security & Privacy Card */}
        <Card variant="inset" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ShieldCheck size={24} color={colors.success} style={{ marginRight: spacing.md }} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.headline, { color: colors.textPrimary, fontSize: 15 }]}>
              100% Offline & Private
            </Text>
            <Text style={[typography.footnote, { color: colors.textSecondary, marginTop: 2 }]}>
              Your financial data is stored locally on your device in SQLite. No cloud servers, no account required.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
  },
  content: {
    paddingBottom: 40,
  },
  sectionTitle: {
    paddingHorizontal: 4,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeSegmentControl: {
    flexDirection: 'row',
  },
  themeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  navIconBox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 0.5,
  },
});
