import React from "react";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
 
const API_URL = "https://us-west-1c.zuperpro.com/api/jobs";
 
const ItemCard = ({ item, onViewDetails }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>{item.job_title}</Text>
          
          {/* Job created time */}
          <Text style={styles.description}>
            Created Time: {new Date(item.job_status[0].created_at).toLocaleDateString()}
          </Text>
 
          {/* Customer Name */}
          <View style={styles.row}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>
              {item.customer.customer_first_name} {item.customer.customer_last_name}
            </Text>
          </View>
 
          {/* Assigned worker */}
          <View style={styles.row}>
            <Text style={styles.label}>Worker Name:</Text>
            <Text style={styles.value}>
              {item.assigned_to[0].user.first_name} {item.assigned_to[0].user.last_name}
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
 
 
const Dashboard = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    fetchData();
  }, [isFocused]);
  
  const fetchData = async () => {
    // Reset states before fetching
    setLoading(true);
    setError(null);
    
    try {
      const authToken = await SecureStore.getItemAsync('auth_token');
      if (!authToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }
      
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "x-api-key": API_KEY,
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
    // Navigate to a details screen with the selected job
    // You'll need to implement a JobDetails screen
    // navigation.navigate('JobDetails', { job: item });
    console.log("View details for job:", item.id);
    // Replace the console.log with actual navigation when you have a details screen
  };
 
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No data</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
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
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
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