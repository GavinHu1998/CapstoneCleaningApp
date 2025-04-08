import React, { useState, useEffect } from 'react'; // Import useEffect
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator, // Import ActivityIndicator for loading state
  Image,             // Import Image for the error view
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';

const JobEntryForm = () => {
  // --- State for token check ---
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  // ----------------------------

  // Services object for radio button options
  const services = {
    "Industrial Cleaning": "9a049c40-762e-11ed-b69d-4f8d33504853",
    "Power Wash Services": "9a3e9800-762e-11ed-b69d-4f8d33504853",
    "Janitorial Services": "9a797e20-762e-11ed-9f8a-95446408ef89",
    "Move in Move Out Cleaning": "34af4e50-8bbc-11ed-80f2-afd5b4091e60",
    "Carpet Cleaning services": "4a9dc700-8bbc-11ed-9bba-57884afa0b45",
    "Inspection": "049018a0-a3d4-11ed-96bd-a1f303cf55f7",
    "Cleaning Bid Walkthrough": "82855a10-a7b5-11ed-9301-014923b072bf",
    "Quotation": "47388480-ae01-11ed-b932-7def8bbc46af"
  };

  // Form state
  const [formData, setFormData] = useState({
    job: {
      job_title: 'Test Job',
      job_description: 'Test Job',
      job_category: '9a049c40-762e-11ed-b69d-4f8d33504853',
      scheduled_start_time: '2024-02-05 09:15:00',
      scheduled_end_time: '2024-04-01 10:20:00',
      customer: {
        customer_first_name: 'Test',
        customer_last_name: 'Test',
        customer_email: 'Test@gmai.com',
      },
      customer_address: {
        city: 'Toronto',
        state: 'ON',
        street: '123 Maple Street',
        zip_code: 'M5H 2N2',
        country: 'Canada',
      },
    },
  });

  const API_URL = "https://us-west-1c.zuperpro.com/api/jobs?simulate=true";

  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // --- Effect to check for token on mount ---
  useEffect(() => {
    const checkToken = async () => {
      try {
        const authToken = await SecureStore.getItemAsync('auth_token');
        if (authToken) {
          setTokenExists(true);
        } else {
          setTokenExists(false);
          setTokenError('Authentication required. Please log in to create jobs.');
        }
      } catch (error) {
        console.error("Error checking auth token:", error);
        setTokenExists(false);
        setTokenError('Failed to check authentication status. Please try again.');
      } finally {
        setIsLoadingToken(false);
      }
    };

    checkToken();
  }, []); // Empty dependency array ensures this runs only once on mount
  // --------------------------------------------

  // Parse datetime string to Date object
  const parseDateTime = (dateTimeStr) => {
    // ... (keep existing parseDateTime function)
    try {
        if (!dateTimeStr || typeof dateTimeStr !== 'string') {
            console.log("Invalid date string provided:", dateTimeStr);
            return new Date(); // Return current date as fallback
        }
        const [datePart, timePart] = dateTimeStr.split(' ');
        if (!datePart || !timePart) {
            console.log("Date string format incorrect:", dateTimeStr);
            return new Date();
        }
        const [year, month, day] = datePart.split('-');
        const [hours, minutes, seconds] = timePart.split(':');
        return new Date(
            parseInt(year), parseInt(month) - 1, parseInt(day),
            parseInt(hours), parseInt(minutes), parseInt(seconds || '00') // Handle potential missing seconds
        );
    } catch (error) {
        console.error("Error parsing date:", error);
        return new Date(); // Return current date as fallback
    }
  };

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      job: {
        ...prevData.job,
        [field]: value,
      }
    }));
  };

  // Update customer info
  const updateCustomerInfo = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      job: {
        ...prevData.job,
        customer: {
          ...prevData.job.customer,
          [field]: value,
        },
      }
    }));
  };

  // Update address info
  const updateAddressInfo = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      job: {
        ...prevData.job,
        customer_address: {
          ...prevData.job.customer_address,
          [field]: value,
        },
      }
    }));
  };

  // Format date to YYYY-MM-DD HH:MM:SS
  const formatDateToString = (date) => {
    // ... (keep existing formatDateToString function)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00'; // Default seconds to 00
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Handle date change for start time
  const onStartDateChange = (event, selectedDate) => {
    // ... (keep existing onStartDateChange function)
    setShowStartDatePicker(false);
    if (selectedDate) {
        const formattedDate = formatDateToString(selectedDate);
        updateFormData('scheduled_start_time', formattedDate);
    }
  };

  // Handle date change for end time
  const onEndDateChange = (event, selectedDate) => {
    // ... (keep existing onEndDateChange function)
    setShowEndDatePicker(false);
    if (selectedDate) {
        const formattedDate = formatDateToString(selectedDate);
        updateFormData('scheduled_end_time', formattedDate);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    // The check here is now more of a safeguard, as the component
    // shouldn't render the form if the token doesn't exist initially.
    try {
      const authToken = await SecureStore.getItemAsync('auth_token');

      if (!authToken) {
        // This alert might be redundant if the error view is shown,
        // but can be kept as an extra check.
        alert('Authentication token not found. Cannot submit.');
        setTokenExists(false); // Update state if token disappears unexpectedly
        setTokenError('Authentication required. Please log in again.');
        return;
      }

      // Basic validation example (add more as needed)
      if (!formData.job.job_title.trim() ||
          !formData.job.job_category ||
          !formData.job.scheduled_start_time ||
          !formData.job.scheduled_end_time ||
          !formData.job.customer.customer_first_name.trim() ||
          !formData.job.customer.customer_last_name.trim() ||
          !formData.job.customer.customer_email.trim() || // Add email validation if needed
          !formData.job.customer_address.street.trim() ||
          !formData.job.customer_address.city.trim() ||
          !formData.job.customer_address.state.trim() ||
          !formData.job.customer_address.zip_code.trim()
         ) {
           alert('Please fill in all required fields (*).');
           return;
         }


      console.log("Submitting Form Data:", JSON.stringify(formData, null, 2)); // Log before sending

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Job entry submitted successfully!');
        console.log('Server response:', data);
        // Optionally clear the form or navigate away
        // setFormData({ ...initial state... });
      } else {
        console.error('Submission failed:', data);
        // Provide more specific error if available from 'data'
        alert(`Failed to submit job: ${data.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // RadioButton component
  const RadioButton = ({ onPress, selected, children }) => {
    // ... (keep existing RadioButton component)
    return (
        <TouchableOpacity style={styles.radioButton} onPress={onPress}>
          <View style={styles.radioButtonIcon}>
            {selected ? <View style={styles.radioButtonIconInnerIcon} /> : null}
          </View>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      );
  };


  // --- Conditional Rendering Logic ---

  if (isLoadingToken) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#075099" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!tokenExists) {
    return (
      <View style={styles.centeredContainer}>
        {/* Ensure the path to your image is correct */}
        <Image
          source={require('../assets/images/111.png')} // Make sure this path is valid
          style={styles.noDataImage}
          resizeMode="contain"
        />
        <Text style={styles.errorText}>{tokenError}</Text>
        {/* You might want to add a Login button here */}
      </View>
    );
  }

  // --- Render the form if token exists ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create New Job</Text>

        {/* Job Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>

          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.job_title}
            onChangeText={(text) => updateFormData('job_title', text)}
            placeholder="Enter job title"
          />

          <Text style={styles.label}>Job Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.job.job_description}
            onChangeText={(text) => updateFormData('job_description', text)}
            placeholder="Enter job description"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Job Category *</Text>
          <View style={styles.radioGroup}>
            {Object.entries(services).map(([name, value]) => (
              <RadioButton
                key={value}
                onPress={() => updateFormData('job_category', value)}
                selected={formData.job.job_category === value}
              >
                {name}
              </RadioButton>
            ))}
          </View>

          <Text style={styles.label}>Scheduled Start Time *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.job.scheduled_start_time || "Select date and time"}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={parseDateTime(formData.job.scheduled_start_time)}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Improved display handling
              onChange={onStartDateChange}
              minimumDate={new Date()} // Optional: prevent selecting past dates
            />
          )}

          <Text style={styles.label}>Scheduled End Time *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.job.scheduled_end_time || "Select date and time"}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={parseDateTime(formData.job.scheduled_end_time)}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Improved display handling
              onChange={onEndDateChange}
              minimumDate={parseDateTime(formData.job.scheduled_start_time) || new Date()} // End time should be after start time
            />
          )}
        </View>

        {/* Customer Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>

          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer.customer_first_name}
            onChangeText={(text) => updateCustomerInfo('customer_first_name', text)}
            placeholder="Enter first name"
          />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer.customer_last_name}
            onChangeText={(text) => updateCustomerInfo('customer_last_name', text)}
            placeholder="Enter last name"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer.customer_email}
            onChangeText={(text) => updateCustomerInfo('customer_email', text)}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Address</Text>

          <Text style={styles.label}>Street *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer_address.street}
            onChangeText={(text) => updateAddressInfo('street', text)}
            placeholder="Enter street address"
          />

          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer_address.city}
            onChangeText={(text) => updateAddressInfo('city', text)}
            placeholder="Enter city"
          />

          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer_address.state}
            onChangeText={(text) => updateAddressInfo('state', text)}
            placeholder="Enter state/province" // Changed placeholder
          />

          <Text style={styles.label}>ZIP Code *</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer_address.zip_code}
            onChangeText={(text) => updateAddressInfo('zip_code', text)}
            placeholder="Enter postal/ZIP code" // Changed placeholder
            // Consider keyboardType based on target audience (numeric vs default)
          />

          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={formData.job.customer_address.country}
            onChangeText={(text) => updateAddressInfo('country', text)}
            placeholder="Enter country"
            // defaultValue is not a prop for TextInput, set initial state instead
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // --- Added/Modified Styles ---
  centeredContainer: {
    flex: 1,
    padding: 10, // Increased padding
    backgroundColor: "#f5f5f5",
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noDataImage: {
    width: '100%',
    height: 300,
    marginBottom: 20
  },
  // --- Existing Styles ---
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495e',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#7f8c8d',
    fontWeight: '600', // Make labels slightly bolder
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10, // Use paddingHorizontal
    paddingVertical: 12, // Use paddingVertical
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333', // Darker text color
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // pickerContainer is not used, removed for clarity
  // picker is not used, removed for clarity
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12, // Consistent padding
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center', // Center text vertically
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#075099',
    padding: 15,
    borderRadius: 8, // Slightly more rounded
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Increased spacing
    paddingVertical: 5, // Add some vertical padding for easier tapping
  },
  radioButtonIcon: {
    height: 22, // Slightly larger
    width: 22, // Slightly larger
    borderRadius: 11, // Adjust for size
    borderWidth: 2,
    borderColor: '#075099',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12, // Increased spacing
  },
  radioButtonIconInnerIcon: {
    height: 11, // Adjust for size
    width: 11, // Adjust for size
    borderRadius: 5.5, // Adjust for size
    backgroundColor: '#075099',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1, // Allow text to wrap if needed
  },
});

export default JobEntryForm;