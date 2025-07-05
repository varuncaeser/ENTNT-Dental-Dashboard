// src/utils/constants.js

export const USERS = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" },
];

export const LOCAL_STORAGE_KEYS = {
  USERS: 'dentalCenterUsers',
  PATIENTS: 'dentalCenterPatients',
  INCIDENTS: 'dentalCenterIncidents',
  CURRENT_USER: 'dentalCenterCurrentUser',
};

[cite_start]// Initial mock data as per assignment [cite: 68, 70, 74, 83]
export const INITIAL_MOCK_DATA = {
  users: USERS, // Use the hardcoded users
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      healthInfo: "No allergies",
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-11-20",
      contact: "0987654321",
      healthInfo: "Seasonal allergies",
    },
    {
      id: "p3",
      name: "Peter Jones",
      dob: "2000-03-15",
      contact: "1122334455",
      healthInfo: "Asthma",
    },
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Toothache",
      description: "Upper molar pain",
      comments: "Sensitive to cold",
      appointmentDate: "2025-07-08T10:00:00", // Future date
      cost: 80,
      treatment: "Filling",
      status: "Completed",
      nextDate: null,
      files: [{ name: "invoice-p1-i1.pdf", url: "data:application/pdf;base64,JVBERi0xLjEKJcOkwNDAgb2JqCjw8L1R5cGUvRXhwZXJpbWVudGF0aW9uCj4+CmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZwovUGFnZXMgMiAwIFEKtj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMKvF>L1JQQiAyIDAgUgovQ291bnQgMQpAL0tBfCBdCj4+CmVuZG9iagojIDAgb2JqCjw8L1R5cGUvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCj4+CmVuZG9iagQgdHJhbiAKNTQ2IDAgTgotY3JlYXRlZCAoZ2VuZXJhdGVkIGZpbGUgdXNlZCBmb3IgdGVzdGluZyBwdXJwb3NlcykgCi0xLjcgCi00IDAgUgovU2l6ZSA1CkwvUm9vdCAxIDAgUgovSW5mbyA0IDAgUgovSUQgWyAxMjM0NTY3ODkwYWJjZGVmIDAxMjM0NTY3ODkwYWJjZGVmIF0KPj4Kc3RhcnR4cmVmCjAgCiUlRU9G" }, { name: "xray-p1-i1.png", url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" }],
    },
    {
      id: "i2",
      patientId: "p1",
      title: "Routine Check-up",
      description: "Annual dental check-up",
      comments: "Patient in good health",
      appointmentDate: "2025-06-15T14:30:00", // Past date
      cost: 120,
      treatment: "Cleaning and X-rays",
      status: "Completed",
      nextDate: "2026-06-15T14:30:00",
      files: [],
    },
    {
      id: "i3",
      patientId: "p2",
      title: "Filling Cavity",
      description: "Lower left molar cavity",
      comments: "Small cavity, needs filling",
      appointmentDate: "2025-07-10T09:00:00", // Future date
      cost: null,
      treatment: null,
      status: "Pending",
      nextDate: null,
      files: [],
    },
    {
      id: "i4",
      patientId: "p3",
      title: "Wisdom Tooth Extraction",
      description: "Impacted wisdom tooth",
      comments: "Needs immediate extraction",
      appointmentDate: "2025-07-05T11:00:00", // Future date (today)
      cost: null,
      treatment: null,
      status: "Scheduled",
      nextDate: null,
      files: [],
    },
    {
      id: "i5",
      patientId: "p1",
      title: "Follow-up Check",
      description: "Check on previous filling",
      comments: "No issues reported",
      appointmentDate: "2025-07-09T16:00:00", // Future date
      cost: null,
      treatment: null,
      status: "Scheduled",
      nextDate: null,
      files: [],
    },
  ],
};