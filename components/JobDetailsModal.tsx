import React from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import JobDetails from './JobDetail';

interface JobDetailsModalProps {
  visible: boolean;
  job: any;
  onClose: () => void;
}

const JobDetailsModal = ({ visible, job, onClose }: JobDetailsModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {job && <JobDetails job={job} onClose={onClose} />}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
});

export default JobDetailsModal;