const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fdf6f0',
    },
    header: {
      backgroundColor: '#f58220',
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    dateTime: {
      alignItems: 'center',
      marginVertical: 10,
    },
    date: {
      fontSize: 14,
      color: '#555',
    },
    clock: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#333',
    },
    scrollContainer: {
      paddingHorizontal: 10,
      flex: 1,
    },
    card: {
      backgroundColor: '#ffd733',
      padding: 10,
      borderRadius: 10,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    moduleCode: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      flex: 1,
    },
    timeSpent: {
      fontSize: 14,
      fontWeight: '600',
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    taskName: {
      marginLeft: 8,
      fontSize: 14,
      flex: 1,
    },
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
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#f58220',
      padding: 10,
    },
  });
  