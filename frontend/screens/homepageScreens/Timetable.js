import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProgressBar = ({ percentage }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${percentage}%` }]} />
  </View>
);

const AssignmentCard = ({ title, percentage, dueDate, type = 'assignment' }) => (
  <View style={[styles.card, type === 'assignment' ? styles.assignmentCard : styles.projectCard]}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardContent}>
      <View style={styles.progressSection}>
        <ProgressBar percentage={percentage} />
        <Text style={styles.progressText}>{percentage} % Completed</Text>
      </View>
      <Text style={styles.dueDate}>{dueDate}</Text>
    </View>
  </View>
);

const LectureCard = ({ title, room, time }) => (
  <View style={styles.lectureCard}>
    <View style={styles.lectureContent}>
      <Text style={styles.lectureTitle}>{title}</Text>
      <Text style={styles.lectureRoom}>{room}</Text>
    </View>
    <Text style={styles.lectureTime}>{time}</Text>
  </View>
);

const FreeTimeCard = () => (
  <View style={styles.freeTimeCard}>
    <Text style={styles.freeTimeText}>You don't have anything to do!</Text>
  </View>
);

const DateSection = ({ date, children }) => (
  <View style={styles.dateSection}>
    <Text style={styles.dateHeader}>{date}</Text>
    <View style={styles.dateLine} />
    {children}
  </View>
);

const BottomNavigation = () => (
  <View style={styles.bottomNav}>
    <Icon name="home" size={28} color="#333" />
    <Icon name="people" size={28} color="#666" />
    <Icon name="calendar-today" size={28} color="#666" />
    <Icon name="access-time" size={28} color="#666" />
    <Icon name="shopping-cart" size={28} color="#666" />
  </View>
);

const Timetable = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C42" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Icon name="schedule" size={24} color="#333" />
          </View>
          <Text style={styles.appName}>GrindHub</Text>
        </View>
        <Icon name="person" size={28} color="#333" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sunday, 25th May 2025 */}
        <DateSection date="Sun, 25th May 2025">
          <AssignmentCard
            title="CS1010s - Mission 1"
            percentage={20}
            dueDate="Due 25 May - 23:00"
          />
          <AssignmentCard
            title="MA2108S - Assignment 1"
            percentage={20}
            dueDate="Due 25 May - 23:00"
          />
        </DateSection>

        {/* Monday, 26th May 2025 */}
        <DateSection date="Mon, 26th May 2025">
          <AssignmentCard
            title="ES1103 - CA1"
            percentage={20}
            dueDate="Due 26 May - 21:00"
          />
        </DateSection>

        {/* Tuesday, 27th May 2025 - Wednesday, 28th May 2025 */}
        <DateSection date="Tue, 27th May 2025 - Wed, 28th May 2025">
          <FreeTimeCard />
        </DateSection>

        {/* Thursday, 29th May 2025 */}
        <DateSection date="Thu, 29th May 2025">
          <LectureCard
            title="CS2109S - Lecture"
            room="LT27"
            time="13:00 - 15:00"
          />
          <LectureCard
            title="MA2108S - Tutorial"
            room="S16-0204"
            time="17:00 - 18:00"
          />
          <AssignmentCard
            title="CS3244 - Group Project 2"
            percentage={90}
            dueDate="Due 29 May - 21:00"
            type="project"
          />
        </DateSection>

        {/* Friday, 30th May 2025 */}
        <DateSection date="Fri, 30th May 2025">
          <LectureCard
            title="MA1100T - Lecture"
            room="LT27"
            time="13:00 - 15:00"
          />
        </DateSection>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSection: {
    marginTop: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateLine: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 15,
  },
  card: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  assignmentCard: {
    backgroundColor: '#FFD93D',
  },
  projectCard: {
    backgroundColor: '#FFD93D',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSection: {
    flex: 1,
    marginRight: 15,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  lectureCard: {
    backgroundColor: '#FF8C42',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lectureContent: {
    flex: 1,
  },
  lectureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lectureRoom: {
    fontSize: 14,
    color: '#333',
  },
  lectureTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  freeTimeCard: {
    backgroundColor: '#90EE90',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  freeTimeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingVertical: 15,
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 20,
  },
});

export default Timetable;