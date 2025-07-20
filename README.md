React Native Assignment: Document Management System Interface

Develop a mobile application using React Native that allows users to manage documents effectively. The app should enable users to upload, tag, search, preview, and download documents seamlessly. While the backend is built with .NET and MySQL, your primary focus will be on the frontend implementation.

=========================
ASSIGNMENT REQUIREMENTS
=========================

1. Project Setup

  1.1. Initialize a New React Native Project
    - Use `npx react-native init DMSApp` to create a new project.
    - Set up a GitHub repository and provide the URL at the beginning of your assignment.

  1.2. Configure Project Structure
    - Implement navigation using @react-navigation/native.
    - Organize your project into components, screens, and services directories.

2. Login

  2.1. OTP-Based Login
    - Implement a login screen for mobile number entry.
    - Upon submission, an OTP is sent to the user’s mobile.
    - Provide interface to enter OTP.
    - On success, store token for authenticated requests.

3. File Upload

  3.1. File Upload Component
    - Date Picker for document date.
    - Dropdown for 'Personal'/'Professional' (major_head).
    - Dynamic sub-category dropdown:
      * If 'Personal': John, Tom, Emily, etc.
      * If 'Professional': Accounts, HR, IT, Finance, etc.
    - Tag input as tokens/chips.
      * Fetch tags from endpoint.
      * Allow new tag addition; save automatically.
    - Remarks field.
    - Restrict files to images and PDFs (upload/take picture option).

4. File Search

  4.1. Search Component
    - Dropdowns for categories.
    - Input for tags.
    - From & To date pickers for search range.

5. File Preview and Download

  5.1. Display Search Results
    - List results with options:
      * Preview:
        - Image/PDF: show preview in app.
        - Others: show 'Preview not available.'
      * Download:
        - Download individual file.
        - Download all as ZIP (BONUS).

Additional Instructions
  - Use State Management (Context API or Redux).
  - Responsive design for different device sizes.
  - CLEAR README: document setup, instructions, run/test, overview.
  - Use incremental git commits with meaningful messages.
  - Follow the Postman Collection for API endpoints.

=========================
README / PROJECT SUMMARY
=========================

# React Native Document Management System

This is a mobile Document Management System app built with React Native.

## Features

- **OTP-based Login:** Users authenticate via mobile and OTP.
- **File Upload:** Upload image/PDF from gallery or camera. Select date, category, sub-category, add tags (fetched/new), remarks.
- **Search:** Filter documents by category, sub-category, date, and tags.
- **Preview:** In-app preview for images and PDFs, with messaging for unsupported formats.
- **Download:** Download or share documents using device-native dialogs.

## Project Structure

/DMSApp
/components
/screens
/services
/context
/utils
App.js

- Navigation: @react-navigation/native
- State: Context API
- Style: Custom React Native styles, responsive layouts

## Setup & Running

1. Clone
2. git clone [YOUR_GITHUB_URL]
cd DMSApp
2. Install
3. Start
   npm start
4. Run on device (Expo Go or emulator)

## Usage

- **Login:** Enter a registered mobile, receive OTP, verify.
- **Upload:** Tap 'Choose File'/'Take Photo', fill metadata, add/select tags, remarks, and upload.
- **Search:** Apply filters and view file list. Preview or download any document.
  
## Assignment Completion Status

| Feature         | Status     |
|-----------------|------------|
| OTP Login       | ✅          |
| Upload Img/PDF  | ✅          |
| Dynamic Dropdown| ✅          |
| Tag Input/Fetch | ✅          |
| Date Picker     | ✅          |
| Search          | ✅          |
| Preview (Img/PDF)| ✅         |
| Download (Share)| ✅          |
| Responsive UI   | ✅          |
| README          | ✅          |
| (ZIP Download)  | Not implemented (bonus)* |

