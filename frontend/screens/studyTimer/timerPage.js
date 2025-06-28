import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskItem = ({ name, progress }) => (
  <View style={styles.taskItem}>
    <Ionicons name="play-circle" size={16} color="black" />
    <Text style={styles.taskName}>{name}</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
  </View>
);

const ModuleCard = ({ moduleCode, timeSpent, tasks }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Ionicons name="play" size={20} color="black" />
      <Text style={styles.moduleCode}>{moduleCode}</Text>
      <Text style={styles.timeSpent}>{timeSpent}</Text>
    </View>
    {tasks.map((task, index) => (
      <TaskItem key={index} name={task.name} progress={task.progress} />
    ))}
  </View>
);

export default function GrindHubScreen() {
  const modules = [
    {
      moduleCode: 'ST2131',
      timeSpent: '01:24:33',
      tasks: [
        { name: 'Homework 1', progress: 100 },
        { name: 'Finals Recap', progress: 60 },
      ],
    },
    {
      moduleCode: 'CS2040',
      timeSpent: '04:12:33',
      tasks: [
        { name: 'Lab 1', progress: 40 },
      ],
    },
    {
      moduleCode: 'CS3244',
      timeSpent: '07:36:13',
      tasks: [
        { name: 'Group Project', progress: 100 },
      ],
    },
    {
      moduleCode: 'MA4207',
      timeSpent: '01:36:13',
      tasks: [],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>🔥 GrindHub</Text>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
      </View>

      {/* Date and Time */}
      <View style={styles.dateTime}>
        <Text style={styles.date}>Thu, 29/05</Text>
        <Text style={styles.clock}>13:24:33</Text>
      </View>

      {/* Module Cards */}
      <ScrollView style={styles.scrollContainer}>
        {modules.map((mod, i) => (
          <ModuleCard key={i} {...mod} />
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24} color="#fff" />
        <Ionicons name="people" size={24} color="#fff" />
        <Ionicons name="calendar" size={24} color="#fff" />
        <Ionicons name="time" size={24} color="#fff" />
        <Ionicons name="cart" size={24} color="#fff" />
      </View>
    </View>
  );
}
