// src/components/forms/IncidentForm.jsx
import React, { useState, useEffect } from 'react';
import FileUpload from '../common/FileUpload'; // Import FileUpload component
import { getPatients } from '../../utils/localStorage';

const IncidentForm = ({ incident, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '', // YYYY-MM-DDTHH:mm
    cost: '',
    treatment: '',
    status: 'Scheduled', // Default status
    nextDate: '', // YYYY-MM-DDTHH:mm
    files: [],
  });
  const [errors, setErrors] = useState({});
  const patients = getPatients(); // Get list of patients for the dropdown

  useEffect(() => {
    if (incident) {
      setFormData({
        patientId: incident.patientId || '',
        title: incident.title || '',
        description: incident.description || '',
        comments: incident.comments || '',
        appointmentDate: incident.appointmentDate ? incident.appointmentDate.substring(0, 16) : '', // Trim seconds for datetime-local
        cost: incident.cost || '',
        treatment: incident.treatment || '',
        status: incident.status || 'Scheduled',
        nextDate: incident.nextDate ? incident.nextDate.substring(0, 16) : '',
        files: incident.files || [],
      });
    }
  }, [incident]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFilesChange = (newFiles) => {
    setFormData((prev) => ({ ...prev, files: newFiles }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required.';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date and time are required.';
    } else {
        const appointmentDateTime = new Date(formData.appointmentDate);
        if (isNaN(appointmentDateTime.getTime())) {
            newErrors.appointmentDate = 'Invalid appointment date and time.';
        }
    }
    if (formData.status === 'Completed' && (!formData.cost || isNaN(formData.cost))) {
        newErrors.cost = 'Cost is required and must be a number for completed incidents.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Ensure cost is a number if provided
      const submittedData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : null,
      };
      onSubmit(submittedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
        <select
          id="patientId"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={!!incident} // Disable patient selection if editing existing incident
        >
          <option value="">Select a patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments</label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          rows="2"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">Appointment Date & Time</label>
        <input
          type="datetime-local"
          id="appointmentDate"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.appointmentDate && <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 border-t pt-4 mt-4">Post-Appointment Details</h3>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Pending">Pending (Requires further action)</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      
      {/* Conditional fields for 'Completed' status */}
      {formData.status === 'Completed' && (
        <>
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost ($)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
          </div>
          <div>
            <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">Treatment Details</label>
            <textarea
              id="treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="nextDate" className="block text-sm font-medium text-gray-700">Next Appointment (Optional)</label>
            <input
              type="datetime-local"
              id="nextDate"
              name="nextDate"
              value={formData.nextDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <FileUpload onFilesChange={handleFilesChange} existingFiles={formData.files} />
        </>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {incident ? 'Update Incident' : 'Add Incident'}
        </button>
      </div>
    </form>
  );
};

export default IncidentForm;