import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const isFocused = useIsFocused();

    // State variables to store user data
    const [userData, setUserData] = useState({
        email: '',
        role: '',
        firstName: '',
        lastName: '',
        proPic: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const companyLinks = [
        { title: 'Services Pro', url: 'https://servicespro.ca/' },
        { title: 'About Us', url: 'https://servicespro.ca/about-us/' },
        { title: 'Services', url: 'https://servicespro.ca/office-cleaning-services/' },
        { title: 'Testimonials', url: 'https://servicespro.ca/testimonials/' },
        { title: 'Contact Us', url: 'https://servicespro.ca/contact-us/' },
        { title: 'Works With Us', url: 'https://servicespro.ca/works-with-us/' }
    ];

    // Fetch user data function
    const fetchUserData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [
                fetchedEmail,
                fetchedRole,
                fetchedFirstName,
                fetchedLastName,
                fetchedProPic
            ] = await Promise.all([
                SecureStore.getItemAsync('email'),
                SecureStore.getItemAsync('role'),
                SecureStore.getItemAsync('firstName'),
                SecureStore.getItemAsync('lastName'),
                SecureStore.getItemAsync('proPic')
            ]);

            // Update state with fetched values
            setUserData({
                email: fetchedEmail || '',
                role: fetchedRole || '',
                firstName: fetchedFirstName || '',
                lastName: fetchedLastName || '',
                proPic: fetchedProPic || ''
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);
    const handleLogout = () => {
        try {
          SecureStore.deleteItemAsync('auth_token');
          SecureStore.deleteItemAsync('email');
          SecureStore.deleteItemAsync('role');
          SecureStore.deleteItemAsync('firstName');
          SecureStore.deleteItemAsync('lastName');
          SecureStore.deleteItemAsync('proPic');
          alert('logout successfully');
          navigation.reset({
            index: 0,
            routes: [{ name: 'login' }] 
          });
    
    
        } catch (error) {
          console.error("Failed to remove token", error);
        }
    
      }

    // Fetch data on component mount or when focused
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData, isFocused]);

    // Handle pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserData();
    }, [fetchUserData]);

    const openLink = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log(`Cannot open URL: ${url}`);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    // Render avatar or placeholder
    const renderAvatar = () => {
        if (isLoading) {
            return (
                <View style={[styles.avatar, styles.placeholderAvatar, styles.loadingContainer]}>
                    <ActivityIndicator size="large" color="#007aff" />
                </View>
            );
        }

        return userData.proPic ? (
            <Image
                source={{ uri: userData.proPic }}
                style={styles.avatar}
                defaultSource={require('../assets/images/placeholder-avatar.png')} 
            />
        ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.placeholderText}>
                    {userData.firstName ?
                        `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}` :
                        '?'
                    }
                </Text>
            </View>
        );
    };


    const renderUserInfo = () => {
        if (isLoading) {
            return (
                <View style={styles.userInfoContainer}>
                    <Text style={styles.userInfo}>Loading user information...</Text>
                </View>
            );
        }

        if (!userData.email) {
            return (
                <View style={styles.userInfoContainer}>
                    <Text style={styles.userInfoError}>No user information available</Text>
                    <Text style={styles.userInfoErrorSub}>Please log in or sync your profile</Text>
                </View>
            );
        }

        return (
            <View style={styles.userInfoContainer}>
                <Text style={styles.userInfo}>Email: {userData.email}</Text>
                <Text style={styles.userInfo}>Role: {userData.role || 'Not specified'}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007aff']}
                        tintColor="#007aff"
                    />
                }
            >
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {renderAvatar()}
                    </View>
                    <Text style={styles.name}>
                        {userData.firstName && userData.lastName
                            ? `${userData.firstName} ${userData.lastName}`
                            : 'User Profile'}
                    </Text>

                    {renderUserInfo()}
                </View>

                <View style={styles.linksContainer}>
                    {companyLinks.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.linkButton}
                            onPress={() => openLink(link.url)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.linkText}>{link.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7', 
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
        paddingHorizontal: 20
    },
    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 15
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholderAvatar: {
        backgroundColor: '#e5e5ea', 
    },
    placeholderText: {
        fontSize: 48,
        color: '#8e8e93',
        fontWeight: '600'
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        fontSize: 24,
        fontWeight: '600', 
        color: '#000',
        marginBottom: 10,
        letterSpacing: -0.5,
        textAlign: 'center'
    },
    userInfoContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)', 
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '100%',
        maxWidth: 350
    },
    userInfo: {
        fontSize: 16,
        color: '#6d6d72', 
        marginBottom: 5,
        textAlign: 'center'
    },
    userInfoError: {
        fontSize: 18,
        color: '#ff3b30', 
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: '600'
    },
    userInfoErrorSub: {
        fontSize: 14,
        color: '#8e8e93',
        textAlign: 'center'
    },
    linksContainer: {
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15
    },
    linkButton: {
        backgroundColor: "#075099", 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        width: '45%',
        alignItems: 'center',
        shadowColor: '#007aff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 7,
        elevation: 5,
        transform: [{ scale: 1 }]
    },
    linkText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        letterSpacing: -0.3
    },
    logoutButton: {
        backgroundColor: '#D62A1E',
        height: 55,
        width: '90%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
      }
});

export default Profile;