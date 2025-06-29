import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function ModuleDetailScreen({ navigation }) {
  const route = useRoute();

  const data = {
    labels: ['21/05', '22/05', '23/05', '24/05', '25/05', '26/05', '27/05'],
    datasets: [
      {
        data: [8, 10, 13, 7, 9, 1, 2],
        color: () => '#FFD93D',
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8400" barStyle="light-content" />

      <GrindHubHeader navigation={navigation} />

      <View style={styles.content}>
        <View style={styles.moduleCodeBox}>
        <Text style={styles.moduleCode}>{route.params?.moduleCode}</Text>
        </View>

        <View style={styles.targetCard}>
          <View style={styles.targetRow}>
            <Text style={styles.label}>Target</Text>
            <Text style={styles.valueBox}>Weekly</Text>
          </View>
          <View style={styles.targetRow}>
            <Text style={styles.label}>Number of Hours</Text>
            <Text style={styles.valueBox}>20</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Learning Progress</Text>
            <Text style={styles.statusBox}>On Track</Text>
          </View>
          <LineChart
            data={data}
            width={screenWidth * 0.85}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: () => '#FACC15',
              labelColor: () => '#1F2937',
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#EA580C',
              },
            }}
            bezier
            style={styles.chartStyle}
          />
        </View>

        <TouchableOpacity style={styles.setTargetBtn}>
          <Text style={styles.setTargetText}>Set Target</Text>
        </TouchableOpacity>
      </View>

      <GrindHubFooter navigation={navigation} activeTab={route.name} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FED7AA' },
  content: { paddingHorizontal: 16, paddingBottom: 100 },

  moduleCodeBox: {
    backgroundColor: '#FFD93D',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  moduleCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  targetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  valueBox: {
    backgroundColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBox: {
    backgroundColor: '#BBF7D0',
    color: '#166534',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 14,
  },
  chartStyle: {
    borderRadius: 12,
  },

  setTargetBtn: {
    backgroundColor: '#FFD93D',
    paddingVertical: 14,
    marginTop: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  setTargetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});