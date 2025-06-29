import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';

export default function GrindHubScreen({ navigation }) {
  const route = useRoute();

  const modules = [
    {
      code: 'ST2131',
      time: '01:24:33',
      tasks: [
        { name: 'Homework 1', progress: 100 },
        { name: 'Finals Recap', progress: 60 },
      ],
    },
    {
      code: 'CS2040',
      time: '04:12:33',
      tasks: [
        { name: 'Lab 1', progress: 40 },
      ],
    },
    {
      code: 'CS3244',
      time: '07:36:13',
      tasks: [
        { name: 'Group Project', progress: 100 },
      ],
    },
    {
      code: 'MA4207',
      time: '01:36:13',
      tasks: [],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f58220" barStyle="light-content" />

      <GrindHubHeader navigation={navigation} />

      <View style={styles.timeContainer}>
        <Text style={styles.date}>Thu, 29/05</Text>
        <Text style={styles.clock}>13:24:33</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {modules.map((mod, i) => (
          <View key={i} style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <TouchableOpacity onPress={() => console.log(`Pressed ${mod.code}`)}>
                <Ionicons name="play" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.moduleCode}>{mod.code}</Text>
              <Text style={styles.timeSpent}>{mod.time}</Text>
            </View>

            {mod.tasks.map((task, j) => (
              <View key={j} style={styles.taskRow}>
                <TouchableOpacity onPress={() => console.log(`Pressed ${task.name}`)}>
                  <Ionicons name="play" size={16} color="#000" />
                </TouchableOpacity>
                <Text style={styles.taskName}>{task.name}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <GrindHubFooter navigation={navigation} activeTab={route.name} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf6f0' },
  timeContainer: { alignItems: 'center', marginVertical: 10 },
  date: { fontSize: 14, color: '#555' },
  clock: { fontSize: 30, fontWeight: 'bold', color: '#333' },
  scrollContainer: { paddingHorizontal: 10, paddingBottom: 100 },
  moduleCard: {
    backgroundColor: '#ffd733',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleCode: { fontWeight: 'bold', fontSize: 16, marginLeft: 8, flex: 1 },
  timeSpent: { fontWeight: 'bold' },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  taskName: { marginLeft: 8, fontSize: 14, flex: 1 },
  progressBar: {
    height: 6,
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'green',
  },
});