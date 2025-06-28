import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ModuleDetailScreen() {
  const data = {
    labels: ['23/05', '24/05', '25/05', '26/05', '27/05'],
    datasets: [
      {
        data: [10, 14, 7, 11, 1],
        color: () => '#fbd12a', // Yellow bars
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>🔥 GrindHub</Text>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
      </View>

      {/* Module Code */}
      <View style={styles.moduleCodeContainer}>
        <Text style={styles.moduleCode}>ST2131</Text>
      </View>

      {/* Target Box */}
      <View style={styles.targetBox}>
        <View style={styles.targetRow}>
          <Text style={styles.label}>Target</Text>
          <Text style={styles.valueBox}>Weekly</Text>
        </View>
        <View style={styles.targetRow}>
          <Text style={styles.label}>Number of Hours</Text>
          <Text style={styles.valueBox}>20</Text>
        </View>
      </View>

      {/* Chart + Status */}
      <View style={styles.chartBox}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Learning Progress</Text>
          <Text style={styles.statusBox}>On Track</Text>
        </View>

        <LineChart
          data={data}
          width={screenWidth * 0.9}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: () => '#fbd12a',
            labelColor: () => '#555',
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#f58220',
            },
          }}
          style={styles.chartStyle}
          bezier
        />
      </View>

      {/* Set Target Button */}
      <TouchableOpacity style={styles.setTargetBtn}>
        <Text style={styles.setTargetText}>Set Target</Text>
      </TouchableOpacity>

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
