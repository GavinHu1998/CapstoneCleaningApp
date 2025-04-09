import React from "react";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Importing the Picker component

const API_URL = "https://us-west-1c.zuperpro.com/api/jobs";

// ItemCard component
const ItemCard = ({ item, onViewDetails }) => {
  const customer = item.customer;
  const assignedUser = item.assigned_to?.[0]?.user;

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>{item.job_title}</Text>

          {/* Job created time */}
          <Text style={styles.description}>
            Created Time: {new Date(item.job_status?.[0]?.created_at || item.created_at).toLocaleDateString()}
          </Text>

          {/* Customer Name */}
          <View style={styles.row}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>
              {customer
                ? `${customer.customer_first_name} ${customer.customer_last_name}`
                : "N/A"}
            </Text>
          </View>

          {/* Assigned worker */}
          <View style={styles.row}>
            <Text style={styles.label}>Worker Name:</Text>
            <Text style={styles.value}>
              {assignedUser
                ? `${assignedUser.first_name} ${assignedUser.last_name}`
                : "Unassigned"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => onViewDetails(item)}
        >
          <Text style={styles.detailButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Dashboard component
const Dashboard = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('filter');
  const [subOption, setSubOption] = useState('');
  const [subOptionsData, setSubOptionsData] = useState([]);
  const [filterParams, setFilterParams] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  // Fetch Data with Filters
  const fetchData = async (filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const authToken = await SecureStore.getItemAsync('auth_token');
      if (!authToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Build the URL with filter parameters
      const queryParams = new URLSearchParams(filterParams).toString();
      const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (response.status === 200) {
        if (result && result.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          setData([]);
          setError("No data available");
        }
      } else if (response.status === 400) {
        setError("Bad request (400)");
        setData([]);
      } else {
        setError(`Error: ${response.status}${result.message ? ` - ${result.message}` : ''}`);
        setData([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error occurred. Please check your connection.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    // Force a complete refresh by resetting all states
    setData([]);
    setError(null);
    setLoading(true);

    // Add a small delay to ensure state updates before fetching
    setTimeout(() => {
      fetchData();
    }, 100);
  };

  const handleViewDetails = (item) => {
    console.log("View details for job:", item.id);
    // Replace the console.log with actual navigation when you have a details screen
  };

  // Handle option change (populating sub-options based on the selected option)
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setSubOption(''); // Reset subOption when option is changed

    // Reset filter params when option is changed
    setFilterParams({});

    let newSubOptionsData = [];

    if (option === 'priority') {
      newSubOptionsData = [
        { label: 'Urgent', value: 'URGENT' },
        { label: 'High', value: 'HIGH' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'Low', value: 'LOW' },
      ];

      // Set default value for subOption (selecting the first option automatically)
      setSubOption('URGENT');
    }

    setSubOptionsData(newSubOptionsData);
  };

  const handleSubOptionChange = (subOption) => {
    setSubOption(subOption);
  };

  const handleSubmit = () => {
    let newFilterParams = {};

    // Build filter params when the submit button is pressed
    if (selectedOption === 'priority' && subOption) {
      newFilterParams = { ...newFilterParams, 'filter.priority': subOption };
    }

    setFilterParams(newFilterParams);  // Update filter params on submit
    fetchData(newFilterParams);  // Trigger the API call with the current filter parameters
  };

  const resetPicker = () => {
    setSelectedOption('filter');
    setSubOption('');
    setSubOptionsData([]);
    setFilterParams({});  // Reset filter params
    fetchData();
  };

  const renderSubOptions = () => {
    if (subOptionsData.length > 0) {
      return (
        <View style={styles.subOptionContainer}>
          <Picker
            selectedValue={subOption}
            onValueChange={handleSubOptionChange}
            style={styles.picker}
          >
            {subOptionsData.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={resetPicker}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Image 
          source={require('../assets/images/111.png')} 
          style={styles.noDataImage} 
          resizeMode="contain"
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Image 
          source={require('../assets/images/111.png')} 
          style={styles.noDataImage} 
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>No data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dropdown list (Picker) */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={handleOptionChange}
          style={styles.picker}
        >
          <Picker.Item label="Filter by..." value="filter" />
          <Picker.Item label="Priority" value="priority" />
        </Picker>
      </View>

      {renderSubOptions()}

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ? item.id.toString() : `item-${index}`}
        renderItem={({ item }) => <ItemCard item={item} onViewDetails={handleViewDetails} />}
        refreshing={loading}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  dropdownContainer: {
    marginBottom: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  subOptionContainer: {
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  submitButton: {
    backgroundColor: "#075099",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
 },
  resetButton: {
    backgroundColor: "#ff5733",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
 },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  centeredContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
    justifyContent: 'center',
    alignItems: 'center',
 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
 },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
 },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
 },
  value: {
    fontSize: 14,
    color: "#666",
  },
  detailButton: {
    backgroundColor: "#075099",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
    alignSelf: "center",
 },
  detailButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
 },
  noDataImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
 },
});

export default Dashboard;

// import { View, Text } from 'react-native'
// import React from 'react'

// const index = () => {
//   return (
//     <View>
//       <Text>index</Text>
//     </View>
//   )
// }

// export default index