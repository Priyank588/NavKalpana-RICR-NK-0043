import * as measurementService from '../services/measurementService.js';

// Add new measurement
export const addMeasurement = async (req, res) => {
  try {
    const { measurements, notes } = req.body;
    
    if (!measurements) {
      return res.status(400).json({ error: 'Measurements are required' });
    }

    const measurement = await measurementService.addMeasurement(req.user_id, measurements, notes);
    res.status(201).json(measurement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all measurements
export const getAllMeasurements = async (req, res) => {
  try {
    const measurements = await measurementService.getAllMeasurements(req.user_id);
    res.status(200).json(measurements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get latest measurement
export const getLatestMeasurement = async (req, res) => {
  try {
    const measurement = await measurementService.getLatestMeasurement(req.user_id);
    res.status(200).json(measurement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Check if measurement reminder is due
export const checkReminder = async (req, res) => {
  try {
    const reminder = await measurementService.checkMeasurementReminder(req.user_id);
    res.status(200).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Compare measurements and get analysis
export const compareMeasurements = async (req, res) => {
  try {
    const comparison = await measurementService.compareMeasurements(req.user_id);
    res.status(200).json(comparison);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get measurement history for visualization
export const getMeasurementHistory = async (req, res) => {
  try {
    const history = await measurementService.getMeasurementHistory(req.user_id);
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  addMeasurement,
  getAllMeasurements,
  getLatestMeasurement,
  checkReminder,
  compareMeasurements,
  getMeasurementHistory
};
