import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    company_login_name: 'Services-Pro',
    email: 'l.fan637@mybvc.ca',
    password: 'test1234'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleLogout = () => {
    try {
      SecureStore.deleteItemAsync('auth_token');
      SecureStore.deleteItemAsync('email');
      SecureStore.deleteItemAsync('role');
      SecureStore.deleteItemAsync('firstName');
      SecureStore.deleteItemAsync('lastName');
      SecureStore.deleteItemAsync('proPic');
      alert('logout successfully');

    } catch (error) {
      console.error("Failed to remove token", error);
    }

  }

  const handleLogin = async () => {  // Made async for SecureStore
    // Input validation
    if (!formData.company_login_name.trim()) {
      alert('Please enter your company login name');
      return;
    }
    if (!formData.email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!formData.password.trim()) {
      alert('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://us-west-1c.zuperpro.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Handle different status codes
      switch (response.status) {
        case 200:
          // Successful login - store the auth_token
          await SecureStore.setItemAsync('auth_token', data.auth_token);
          await SecureStore.setItemAsync('email', data.user.email);
          await SecureStore.setItemAsync('role', data.user.role);
          await SecureStore.setItemAsync('firstName', data.user.first_name);
          await SecureStore.setItemAsync('lastName', data.user.last_name);
          await SecureStore.setItemAsync('proPic', data.user.profile_picture);

          setIsLoading(false);
          console.log('Success:', data);
          alert('Login successful!');
          // You might want to navigate to another screen here
          navigation.reset({
            index: 0,
            routes: [{ name: 'dashboard' }]
          });
          break;

        case 401:
          setIsLoading(false);
          alert('Unauthorized: Invalid credentials');
          break;

        case 500:
          setIsLoading(false);
          alert('Server error. Please try again later.');
          break;

        default:
          setIsLoading(false);
          alert('Unexpected error occurred');
          break;
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
      alert('Login failed. Please check your connection and try again.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={{ width: 200, height: 200 }}
            />
            {/* <Text style={styles.headerTitle}>Welcome Back</Text> */}
          </View>

          <View style={styles.formContainer}>
            {/* Company Login Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Company Login Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter company login name"
                  value={formData.company_login_name}
                  onChangeText={(value) => handleChange('company_login_name', value)}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>

            {/* Logout Button */}
            {/* <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={isLoading}
            >
              <Text style={styles.logoutButtonText}>
                Logout
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FFF',
    height: 55,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#075099',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#D62A1E',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
