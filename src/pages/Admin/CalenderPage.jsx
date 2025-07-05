// src/pages/Admin/CalendarPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { getIncidents, getPatients } from '../../utils/localStorage';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import calendar styles

// Setup date-fns localizer
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState({}); // To map patient IDs to names

  useEffect(() => {
    const fetchedIncidents = getIncidents();
    const fetchedPatients = getPatients();

    const patientMap = fetchedPatients.reduce((acc, patient) => {
      acc[patient.id] = patient.name;
      return acc;
    }, {});
    setPatients(patientMap);

    // Transform incidents into calendar events
    const calendarEvents = fetchedIncidents
      .filter(inc => inc.appointmentDate) // Only include incidents with an appointment date
      .map(inc => ({
        id: inc.id,
        title: `${inc.title} - ${patientMap[inc.patientId] || 'N/A'}`,
        start: new Date(inc.appointmentDate),
        end: new Date(inc.appointmentDate), // For simplicity, end time is same as start for now
        allDay: false,
        resource: inc, // Store the full incident object
      }));
    setEvents(calendarEvents);
  }, []);

  const getEventProp = useMemo(
    () => (event) => {
      // Custom styling for events based on their status
      let backgroundColor = '#3174ad'; // Default blue
      if (event.resource.status === 'Completed') {
        backgroundColor = '#28a745'; // Green
      } else if (event.resource.status === 'Pending') {
        backgroundColor = '#ffc107'; // Yellow
      } else if (event.resource.status === 'Cancelled') {
        backgroundColor = '#dc3545'; // Red
      }
      return { style: { backgroundColor } };
    },
    []
  );

  const EventComponent = ({ event }) => (
    <div className="p-1 text-xs">
      <strong className="block truncate">{event.title}</strong>
      <span className="block text-gray-700">Status: {event.resource.status}</span>
      {event.resource.cost && <span className="block text-gray-700">Cost: ${event.resource.cost}</span>}
      {event.resource.treatment && <span className="block text-gray-700">Treatment: {event.resource.treatment}</span>}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-600 pb-2">Appointment Calendar</h1>
      <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: '700px' }}> {/* Fixed height for calendar */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          popup
          tooltipAccessor={(event) => event.title} // Use title for default tooltip
          eventPropGetter={getEventProp}
          components={{
            event: EventComponent, // Custom event component to show more details
          }}
          // If you want to show details on day click (not individual incidents)
          onSelectSlot={(slotInfo) => {
            // This is for selecting time slots, not for clicking individual days to filter
            // For clicking a day to show scheduled treatments, react-big-calendar doesn't
            // have a direct 'onDayClick' event that filters. You'd typically manage this
            // by filtering your `events` state based on `slotInfo.start`
            // For now, we'll keep it simple to display on the calendar directly.
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;