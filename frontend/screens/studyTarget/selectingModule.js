import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TargetPerformanceScreen() {
  const modules = [
    'ST2131',
    'CS1231',
    'DSA1101',
    'DSA2102',
    'DSA3101',
    'DSA4288M',
    'CS2040',
    'CS3230',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>🔥 GrindHub</Text>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Target and Performance</Text>

      {/* Module List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {modules.map((module, index) => (
          <TouchableOpacity key={index} style={styles.moduleButton}>
            <Text style={styles.moduleText}>{module}</Text>
          </TouchableOpacity>
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
