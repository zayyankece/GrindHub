import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';

export default function HomePage() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { flexDirection: 'row', alignItems: 'center' }]}>
                <Image source={require("../assets/GrindHub Logo Brown.png")} style = {{marginTop:25}}/>
                <Text style= {{marginTop:25}}> GrindHub                                                     Profile </Text>
            </View>

            <ScrollView> 
                <View style={[{flexDirection : 'row', alignItems:"center"}]}>
                    <Text style = {[styles.subText, {marginRight:100, marginLeft:50, marginTop:20}]}>Hello!</Text>
                    <Text style = {[styles.subText, {marginTop:20}]}>Search Bar</Text>
                </View>
                <View style={styles.formCard}> 
                    <Text> Mon, 26 May 2025</Text>
                    <Text> MA2104 Lecture 10.00 - 12.00</Text>
                    <Text> IT1244 Tutorial   13.00 - 14.00</Text>
                    <Text> CS2040 Assignment 1 - 23.59</Text>
                </View>

                <View style={styles.formCard}> 
                    <Text> Study Timer</Text>
                    <Text> Start Study Timer</Text>
                </View>

                <View style={styles.formCard}> 
                    <Text>Your Groups</Text>
                    <Text>GPA 5.00 Hunter</Text>
                    <Text>Guys, Lets finish learning CS3244 tonight, only 300 pages to go</Text>
                </View>

                <View style={styles.formCard}> 
                    <Text>Your Assignments</Text>
                    <Text>HSI2010 - Workshop 1 Assignment</Text>
                    <Text>60% Completed Due 5 Jun 2025</Text>
                </View>

                <View style={styles.formCard}> 
                    <Text>Your Target and Performance</Text>
                    <Text>ST2131</Text>
                    <Text>CS1231</Text>
                    <Text>CS2030</Text>
                    <Text>CS2040</Text>
                    <Text>IT1244</Text>
                    <Text>HSI1000</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Image source={require("../assets/Home.png")} style = {{marginBottom:30}}/>
                <Image source={require("../assets/gmail_groups.png")} style = {{marginBottom:30}}/>
                <Image source={require("../assets/Calendar.png")} style = {{marginBottom:30}}/>
                <Image source={require("../assets/Watch.png")} style = {{marginBottom:30}}/>
                <Image source={require("../assets/Shopping cart.png")} style = {{marginBottom:30}}/>
            </View>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fce9db'
    },
    header : {
        height: 70,
        backgroundColor: '#ff8400',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formCard: {
        backgroundColor: '#FFA333',
        padding: 70,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        margin:15
    },
    footer: {
        height: 90,
        backgroundColor: '#ff8400',
        flexDirection: 'row',
        justifyContent: 'space-around',  // even spacing for menu items
        alignItems: 'center',
        // borderTopWidth: 10,
        // borderTopColor: '#000000',
    },
    subText: {
      fontSize: 25,
      color: '#333',
      marginBottom: 20,}
  });
  
  