import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';

interface JobDetailsProps {
  job: {
    id: string;
    job_title: string;
    customer: {
      customer_first_name: string;
      customer_last_name: string;
      customer_email?: string;
      customer_phone?: string;
    };
    assigned_to: Array<{
      user: {
        first_name: string;
        last_name: string;
        email?: string;
      };
    }>;
    job_status: Array<{
      status: string;
      created_at: string;
      completed_at?: string;
    }>;
    job_description?: string;
  };
  onClose: () => void;
}

const JobDetails = ({ job, onClose }: JobDetailsProps) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        onPress={onClose}
        style={styles.closeButton}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.title}>{job.job_title}</Text>
        <Text style={styles.subtitle}>ID: {job.id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <Text>{job.customer.customer_first_name} {job.customer.customer_last_name}</Text>
        {job.customer.customer_email && <Text>Email: {job.customer.customer_email}</Text>}
        {job.customer.customer_phone && <Text>Phone: {job.customer.customer_phone}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assigned Worker</Text>
        <Text>{job.assigned_to[0].user.first_name} {job.assigned_to[0].user.last_name}</Text>
        {job.assigned_to[0].user.email && <Text>Email: {job.assigned_to[0].user.email}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Status</Text>
        <Text>Status: {job.job_status[0].status}</Text>
        <Text>Created: {new Date(job.job_status[0].created_at).toLocaleString()}</Text>
        {job.job_status[0].completed_at && (
          <Text>Completed: {new Date(job.job_status[0].completed_at).toLocaleString()}</Text>
        )}
      </View>

      {job.job_description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text>{job.job_description}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10,
    padding: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#333',
  },
  section: {
    marginBottom: 25,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
});

export default JobDetails;