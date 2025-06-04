# Task Tracking App 📝

<p align="center">
  <em>A responsive and interactive task tracking application built with React, TypeScript, Sass, and Firebase to help you manage your workflow efficiently.</em>
</p>

**🚀 Live Demo:** (Coming Soon!)

## Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [⚙️ Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Firebase Configuration](#firebase-configuration)
- [🚀 Running the App](#-running-the-app)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [👋 Contact](#-contact)

## ✨ Features

This application allows users to manage their tasks through a clean, Kanban-style board interface.

* **📝 Task Management:** Create, view, and update tasks.
* **🚦 Status Columns:** Organize tasks into "To Do," "Doing," and "Done" columns.
* **💅 Custom Styling:** Modern and clean UI styled with Sass, ensuring a unique look (no CSS frameworks like Tailwind used).
* **📱 Mobile-Responsive:** Designed to work seamlessly across various devices and screen sizes.
* **☁️ Real-time Data:** Firebase Firestore ensures tasks are synced in real-time.
* **👤 User-Specific Tasks:** Firebase Authentication (anonymous) ensures tasks are private to each user session.
* **🎨 Custom Icons:** Font Awesome icons for enhanced visual appeal.
* **➕ Easy Task Addition:** Add tasks directly to specific columns or via a general "New" task button.
* **✏️ Task Editing:** Click on a task to open a modal and edit its details.

## 🛠️ Tech Stack

This project is built using a modern and robust tech stack:

* **Frontend:**
    * [React](https://reactjs.org/) (v18+) - A JavaScript library for building user interfaces.
    * [TypeScript](https://www.typescriptlang.org/) - For static typing and improved developer experience.
* **Styling:**
    * [Sass](https://sass-lang.com/) - CSS preprocessor for more maintainable and powerful stylesheets.
* **Backend & Database:**
    * [Firebase](https://firebase.google.com/)
        * **Firestore:** NoSQL cloud database for real-time data storage and synchronization.
        * **Firebase Authentication:** For user identification (currently anonymous sign-in).
* **Icons:**
    * [Font Awesome](https://fontawesome.com/) - For scalable vector icons.
* **Build Tool (if you followed my Vite suggestion):**
    * [Vite](https://vitejs.dev/) - Next-generation frontend tooling for fast development.
* **Version Control:**
    * [Git](https://git-scm.com/) & [GitHub](https://github.com)

## 📸 Screenshots

*Coming soon*

## ⚙️ Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (which includes npm) (v18 or later recommended)
* [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/wandaazhar007/task-tracking-app.git](https://github.com/wandaazhar007/task-tracking-app.git)
    cd task-tracking-app
    ```

2.  **Install dependencies:**
    Using npm (or yarn if you prefer):
    ```bash
    npm install
    ```
    This will install React, Firebase, Sass, and other necessary packages.

3.  **Set up environment variables for Firebase:**
    You'll need to connect the application to your own Firebase project.
    * Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
    * Enable **Firestore Database** (start in test mode or configure security rules).
    * Enable **Authentication** and add "Anonymous" as a sign-in method.
    * In your Firebase project settings, find your web app's Firebase configuration object.

4.  **Configure Firebase in the App:**
    * Open the `src/App.tsx` file.
    * Locate the `firebaseConfig` object.
    * Replace the placeholder values with your actual Firebase project configuration:
        ```typescript
        // src/App.tsx

        // ...
        const firebaseConfig = {
            apiKey: "YOUR_FIREBASE_API_KEY",
            authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
            projectId: "YOUR_FIREBASE_PROJECT_ID",
            storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
            messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
            appId: "YOUR_FIREBASE_APP_ID"
        };
        // ...
        ```
    * Ensure your Firestore security rules allow authenticated users (even anonymous ones) to read and write to their tasks. An example rule structure:
        ```json
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Make sure 'default-app-id-task-tracker' matches the `appId` constant used in your src/App.tsx for Firestore paths
            // or adjust this path to match your configuration.
            match /artifacts/default-app-id-task-tracker/users/{userId}/tasks/{taskId} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```

## 🚀 Running the App

Once the setup is complete, you can run the development server:

```bash
npm run dev
