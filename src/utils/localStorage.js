// src/utils/localStorage.js
import { LOCAL_STORAGE_KEYS, INITIAL_MOCK_DATA } from './constants';

// Function to initialize localStorage with mock data if empty
export const initializeLocalStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(INITIAL_MOCK_DATA.users));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_MOCK_DATA.patients));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.INCIDENTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_MOCK_DATA.incidents));
  }
};

// Generic function to load data from localStorage
export const loadData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading data from localStorage for key "${key}":`, error);
    return null;
  }
};

// Generic function to saveData to localStorage
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key "${key}":`, error);
  }
};

// User specific functions
export const getCurrentUser = () => loadData(LOCAL_STORAGE_KEYS.CURRENT_USER);
export const setCurrentUser = (user) => saveData(LOCAL_STORAGE_KEYS.CURRENT_USER, user);
export const removeCurrentUser = () => localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);

// Data specific functions
export const getUsers = () => loadData(LOCAL_STORAGE_KEYS.USERS) || [];
export const getPatients = () => loadData(LOCAL_STORAGE_KEYS.PATIENTS) || [];
export const savePatients = (patients) => saveData(LOCAL_STORAGE_KEYS.PATIENTS, patients);
export const getIncidents = () => loadData(LOCAL_STORAGE_KEYS.INCIDENTS) || [];
export const saveIncidents = (incidents) => saveData(LOCAL_STORAGE_KEYS.INCIDENTS, incidents);