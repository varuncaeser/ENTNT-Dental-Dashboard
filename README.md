# Dental Center Management Dashboard

This is a frontend-only Dental Center Management Dashboard built with React, Vite, and Tailwind CSS. The application simulates patient and appointment management, providing different views for Admin (Dentist) and Patient roles. All data is managed locally using `localStorage`, as per the assignment requirements.

## Features

### User Authentication
- **Simulated Login:** Hardcoded users (`admin@entnt.in` / `admin123` for Admin, `john@entnt.in` / `patient123` for Patient).
- **Session Persistence:** User session is maintained using `localStorage`.
- **Role-Based Access Control:** Different dashboards and functionalities are accessible based on the user's role.

### Admin-Only Features (Dentist View)
1.  **Dashboard:**
    - Overview of key performance indicators (KPIs) like total patients, pending/completed treatments, total revenue from completed treatments.
    - Displays upcoming appointments and top patients by incident count.
2.  **Patient Management:**
    - View, add, edit, and delete patient records.
    - Patient details include full name, DOB, contact info, and health notes.
    - Deleting a patient also removes their associated user account and all incidents.
3.  **Appointment / Incident Management:**
    - Manage multiple incidents (appointments/treatments) per patient.
    - Fields include title, description, comments, and appointment datetime.
    - After an appointment, Admins can update:
        - Cost
        - Treatment details
        - Status (Scheduled, Pending, Completed, Cancelled)
        - Next appointment date
        - Attach files (e.g., invoices, images - stored as Base64 in localStorage).
    - Incidents can be searched and filtered by status.
4.  **Calendar View:**
    - Provides a monthly, weekly, and daily view of upcoming appointments.
    - Events are color-coded based on their status.

### Patient-Only Features
- **Personal Dashboard:**
    - View personal health information (DOB, contact, health notes).
    - See a list of upcoming appointments.
    - Access appointment history, including treatment details, costs, next appointment dates, and associated files (previews/downloads).

## Technologies Used

-   **React:** Frontend library for building user interfaces.
-   **Vite:** Fast build tool for modern web projects.
-   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
-   **React Router DOM:** For client-side routing.
-   **`date-fns`:** For date manipulation and formatting.
-   **`react-big-calendar`:** For the interactive calendar view.
-   **`uuid`:** For generating unique IDs for new records.
-   **`localStorage` API:** For simulating a backend and storing all application data locally.

## Project Structure
dental-center-dashboard/
├── public/
├── src/
│   ├── assets/             // Images, icons
│   ├── components/         // Reusable UI components
│   │   ├── common/         // Generic components (Navbar, Sidebar, Layout, FileUpload, PrivateRoute, AdminRoute)
│   │   └── forms/          // Form-specific components (PatientForm, IncidentForm)
│   ├── contexts/           // React Context API for global state (AuthContext)
│   ├── hooks/              // Custom React hooks (empty for this project, but good practice)
│   ├── pages/              // Top-level views/pages
│   │   ├── Auth/           // Authentication pages (LoginPage)
│   │   ├── Admin/          // Admin dashboard and related pages (AdminDashboard, PatientsPage, AppointmentsPage, CalendarPage)
│   │   └── Patient/        // Patient specific view (PatientDashboard)
│   ├── utils/              // Helper functions and utilities
│   │   ├── constants.js    // Hardcoded data, localStorage keys
│   │   └── localStorage.js // localStorage helper functions
│   ├── App.jsx             // Main application component, sets up routing
│   ├── main.jsx            // Entry point for React application
│   └── index.css           // Global styles, Tailwind directives
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <Your-GitHub-Repo-URL>
    cd dental-center-dashboard
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # Or yarn install if you prefer yarn
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will open in your browser, usually at `http://localhost:5173`.

## How to Use

### Login
Use the following credentials:
-   **Admin:** `admin@entnt.in` / `admin123`
-   **Patient:** `john@entnt.in` / `patient123`

### Admin Features
After logging in as Admin, use the sidebar navigation to access:
-   **Dashboard:** Overview of clinic stats.
-   **Patients:** Add, edit, or delete patient records.
-   **Appointments:** Manage all dental incidents, including post-appointment details and file uploads.
-   **Calendar:** View appointments on an interactive calendar.

### Patient Features
After logging in as Patient, you will be redirected to your personal dashboard where you can view your health information and appointment history.

## Technical Decisions

-   **Frontend Framework:** React was chosen for its component-based architecture, which promotes reusability and maintainability.
-   **Build Tool:** Vite provides an extremely fast development server and optimized build process, enhancing developer experience.
-   **Styling:** Tailwind CSS was used for its utility-first approach, allowing for rapid styling directly in JSX without writing traditional CSS. Its responsive design utilities were particularly useful.
-   **State Management:** React's Context API was utilized for global state management (e.g., authentication status). For local component state and data fetching/updating, `useState` and `useEffect` hooks were sufficient given the `localStorage` backend.
-   **Routing:** `react-router-dom` was chosen for declarative navigation within the single-page application. Nested routes and protected routes (AdminRoute, PrivateRoute) were implemented for role-based access control.
-   **Data Persistence:** All data is simulated and stored in `localStorage` to meet the "no backend" requirement. Utility functions were created to abstract `localStorage` operations.
-   **File Storage:** Files uploaded for incidents are converted to Base64 data URLs and stored directly within the `localStorage` incident objects. This bypasses the need for a file server while fulfilling the assignment's requirement. This approach is suitable for small, frontend-only applications but would not be scalable for large files or a large number of files in a production environment.
-   **Calendar:** `react-big-calendar` was integrated for its rich features and good customization options for displaying appointments.

## Potential Improvements / Known Issues

-   **Scalability of `localStorage`:** Storing large amounts of data, especially Base64 encoded files, in `localStorage` can lead to performance issues and storage limits. In a real-world scenario, a proper backend with database and file storage solution would be necessary.
-   **Comprehensive Form Validation:** While basic validation is in place, more advanced validation (e.g., regex for specific fields, custom error messages) could be added.
-   **User Management for Admin:** Currently, only patient data is managed. An Admin user cannot add/edit other Admin or Patient user accounts directly via the UI, only the patient data associated with them. New patient user accounts are automatically created when a patient is added.
-   **UI Enhancements:**
    -   More visually appealing loaders/spinners during data fetching (though minimal due to `localStorage`).
    -   Toast notifications for success/error messages after CRUD operations.
    -   Better modals/dialogs for user interactions.
-   **Error Handling:** More robust error handling could be implemented, especially for `localStorage` operations or unexpected data formats.
-   **Filtering/Sorting Improvements:** More advanced filtering and sorting options for patient and incident lists.

