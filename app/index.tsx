import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  ActivityIndicator 
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";
import JobDetails from "@/components/jobdetails";

const API_URL = "https://us-west-1c.zuperpro.com/api/jobs";

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const authToken = await SecureStore.getItemAsync("auth_token");
      
      if (!authToken) {
        throw new Error("Authentication required");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result?.data && Array.isArray(result.data)) {
        setData(result.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused]);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const handleViewDetails = (item: any) => {
    setSelectedJob(item);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#D62A1E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>No jobs found</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString() || `item-${Math.random()}`}
        renderItem={({ item }) => (
          <JobCard item={item} onPressDetails={handleViewDetails} />
        )}
        refreshing={loading}
        onRefresh={handleRefresh}
      />

      <Modal
        visible={!!selectedJob}
        animationType="slide"
        onRequestClose={() => setSelectedJob(null)}
      >
        {selectedJob && (
          <JobDetails 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </Modal>
    </View>
  );
};

const JobCard = ({ item, onPressDetails }: { item: any, onPressDetails: (item: any) => void }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.job_title}</Text>
      <Text>Client: {item.customer.customer_first_name}</Text>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => onPressDetails(item)}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailButton: {
    backgroundColor: '#075099',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#D62A1E',
    padding: 12,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default Dashboard;