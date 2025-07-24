import React, { useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import GrindHubFooter from '../components/GrindHubFooter';
import GrindHubHeader from '../components/GrindHubHeader';
import { useRoute } from '@react-navigation/native';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function ReportPage({ navigation, route}) {

  const {moduleCode} = route.params

  const { userToken, signOut } = useContext(AuthContext);
  // Decode token to get userid
  const decodedToken = useMemo(() => {
    if (userToken) {
      try {
        return jwtDecode(userToken);
      } catch (e) {
        console.error("Failed to decode token in ChatScreen:", e);
        // If token is invalid, sign out the user
        signOut();
        return null;
      }
    }
    return null;
  }, [userToken, signOut]);

  // Derive userid and username from the decoded token
  const userid = decodedToken?.userid;

  // const moduleCode = "ST2131"

  // const route = useRoute();
  const [targetType, setTargetType] = useState('Weekly');
  const [targetHours, setTargetHours] = useState('20');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempTargetType, setTempTargetType] = useState('Weekly');
  const [tempTargetHours, setTempTargetHours] = useState('20');

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

  // Calculate total hours from data
  const totalHours = data.datasets[0].data.reduce((sum, hours) => sum + hours, 0);
  
  // Determine if on track based on target
  const isOnTrack = totalHours >= parseInt(targetHours || 0);
  const statusText = isOnTrack ? 'On Track' : 'Off Track';
  const statusColor = isOnTrack ? '#BBF7D0' : '#FECACA';
  const statusTextColor = isOnTrack ? '#166534' : '#991B1B';

  const handleSetTarget = () => {
    setTargetType(tempTargetType);
    setTargetHours(tempTargetHours);
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8400" barStyle="light-content" />

      <GrindHubHeader navigation={navigation}/>

      <View style={styles.content}>
        <View style={styles.moduleCodeBox}>
          <Text style={styles.moduleCode}>{moduleCode}</Text>
        </View>

        <View style={styles.targetCard}>
          <View style={styles.targetRow}>
            <Text style={styles.label}>Target</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Text style={styles.valueBox}>{targetType}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.targetRow}>
            <Text style={styles.label}>Number of Hours</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Text style={styles.valueBox}>{targetHours}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Learning Progress</Text>
            <Text style={[styles.statusBox, { backgroundColor: statusColor, color: statusTextColor }]}>
              {statusText}
            </Text>
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

        <TouchableOpacity 
          style={styles.setTargetBtn}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.setTargetText}>Set Target</Text>
        </TouchableOpacity>

        {/* Target Setting Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Study Target</Text>
              
              <Text style={styles.modalLabel}>Target Type</Text>
              <View style={styles.targetTypeContainer}>
                <Pressable
                  style={[styles.targetTypeButton, tempTargetType === 'Daily' && styles.selectedTargetType]}
                  onPress={() => setTempTargetType('Daily')}
                >
                  <Text style={tempTargetType === 'Daily' ? styles.selectedTargetTypeText : styles.targetTypeText}>Daily</Text>
                </Pressable>
                <Pressable
                  style={[styles.targetTypeButton, tempTargetType === 'Weekly' && styles.selectedTargetType]}
                  onPress={() => setTempTargetType('Weekly')}
                >
                  <Text style={tempTargetType === 'Weekly' ? styles.selectedTargetTypeText : styles.targetTypeText}>Weekly</Text>
                </Pressable>
                <Pressable
                  style={[styles.targetTypeButton, tempTargetType === 'Monthly' && styles.selectedTargetType]}
                  onPress={() => setTempTargetType('Monthly')}
                >
                  <Text style={tempTargetType === 'Monthly' ? styles.selectedTargetTypeText : styles.targetTypeText}>Monthly</Text>
                </Pressable>
              </View>

              <Text style={styles.modalLabel}>Number of Hours</Text>
              <TextInput
                style={styles.hoursInput}
                keyboardType="numeric"
                value={tempTargetHours}
                onChangeText={setTempTargetHours}
                placeholder="Enter hours"
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSetTarget}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FED7AA' },
  content: { flex:1,paddingHorizontal: 16, paddingBottom: 100 },
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1F2937',
  },
  targetTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  targetTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectedTargetType: {
    backgroundColor: '#FFD93D',
    borderColor: '#FFD93D',
  },
  targetTypeText: {
    color: '#1F2937',
  },
  selectedTargetTypeText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  hoursInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FFD93D',
  },
  saveButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
});