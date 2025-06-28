import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrindHubHeader from '../../components/GrindHubHeader';
import GrindHubFooter from '../../components/GrindHubFooter';

const GroupChat = ({navigation}) => {
  const groups = [
    {
      id: 1,
      number: 1,
      title: 'Only for people with 5.00 GPA',
      subtitle: 'Guys, let\'s finish entire material tonight',
      hasNotification: true
    },
    {
      id: 2,
      number: 2,
      title: 'Lorem ipsum',
      subtitle: 'yes, the original lorem ipsum tralala',
      hasNotification: false
    },
    {
      id: 3,
      number: 3,
      title: 'ipsum lorem spolkeas',
      subtitle: 'this is just xtras, dont worry so much',
      hasNotification: false
    },
    {
      id: 4,
      number: 9,
      title: 'Sword traioids',
      subtitle: 'who named this group !?',
      hasNotification: false
    },
    {
      id: 5,
      number: null,
      title: 'off campus warrior',
      subtitle: '1 hour in mrt is 1 hour of learning',
      hasNotification: false
    },
    {
      id: 6,
      number: null,
      title: 'we only play football',
      subtitle: 'We all hate Manchester United',
      hasNotification: false
    }
  ];

  const GroupListItem = ({ group }) => (
    <TouchableOpacity style={styles.groupItem} activeOpacity={0.7} onPress={() => {navigation.navigate("ChatScreen")}}>
      <View style={styles.groupLeft}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          {group.number && (
            <View style={[styles.numberBadge, group.number === 1 && styles.redBadge]}>
              <Text style={styles.numberText}>{group.number}</Text>
            </View>
          )}
        </View>
        <View style={styles.groupContent}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.subtitleContainer}>
            <Ionicons name="chatbubble" size={12} color="#666" />
            <Text style={styles.groupSubtitle}>{group.subtitle}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      {/* Header */}
      <GrindHubHeader navigation={navigation}/>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor="#999"
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>
      </View>

      {/* Groups List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {groups.map((group) => (
          <GroupListItem key={group.id} group={group} />
        ))}
        
        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Join/Create Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
          <Text style={styles.joinButtonText}>Join / Create More Groups!</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <GrindHubFooter navigation={navigation} activeTab="GroupChat"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED7AA',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  groupItem: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    marginBottom: 4,
  },
  groupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4DD0E1',
  },
  numberBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redBadge: {
    backgroundColor: '#FF4444',
  },
  numberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  groupContent: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupSubtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 4,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  joinButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  joinButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  }
});

export default GroupChat;