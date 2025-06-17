import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubHeader from '../components/GrindHubHeader';
import GrindHubFooter from '../components/GrindHubFooter';

const GroupDescription = () => {
  const members = [
    { id: 1, username: 'mynameisyou' },
    { id: 2, username: 'halo bang' },
    { id: 3, username: 'wibu' },
    { id: 4, username: 'test-123' },
    { id: 5, username: 'train-213' },
  ];

  const MemberItem = ({ member }) => (
    <TouchableOpacity style={styles.memberItem} activeOpacity={0.7}>
      <View style={styles.memberAvatar} />
      <Text style={styles.memberName}>{member.username}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      {/* Header */}
      <GrindHubHeader navigation={navigation}/>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Group Info Section */}
        <View style={styles.groupInfoSection}>
          <View style={styles.groupAvatar} />
          <Text style={styles.groupTitle}>Only for people with 5.00 GPA</Text>
          <Text style={styles.memberCount}>{members.length} members</Text>
        </View>

        {/* Members List */}
        <View style={styles.membersSection}>
          {members.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))}
        </View>

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {navigation.navigate("HomePage")}}>
          <Ionicons name="home" size={24} color="white"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {navigation.navigate("GroupChat")}}>
          <Ionicons name="people" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {navigation.navigate("Timetable")}}>
          <Ionicons name="calendar" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bag" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
  },
  scrollContainer: {
    flex: 1,
  },
  groupInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  groupAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4F46E5',
    marginBottom: 20,
    // Simulate gradient effect with border
    borderWidth: 3,
    borderColor: '#06B6D4',
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  memberCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  membersSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4DD0E1',
    marginRight: 16,
  },
  memberName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 80,
  },
  bottomNav: {
    backgroundColor: '#FF8400',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  activeNavItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
});

export default GroupDescription;