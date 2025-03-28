import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const JobDetails = () => {
  const params = useLocalSearchParams();
  const job = JSON.parse(params.job as string);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{job.job_title}</Text>
        <Text style={styles.subtitle}>Job ID: {job.id}</Text>
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
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
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