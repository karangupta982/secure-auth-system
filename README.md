# Secure User Authentication System

## System Overview
This is a **MERN stack** (MongoDB, Express, React, Node.js) authentication system designed with robust security features, focusing on secure user registration, login, and session management. The system uses sessions, JWTs, bcrypt for password hashing, and a custom CSRF protection mechanism to control and monitor user activity.

## Features
- **User Registration and Login**: Secure registration and login functionality with password hashing and token-based authentication.
- **Custom CSRF Protection**: Uses a session-stored random ID as a CSRF token, allowing controlled access to requests based on session validity.
- **Granular Session Control**: Immediate session invalidation upon detecting suspicious activity.

## Security Measures Implemented

### 1. Password Security
- **Bcrypt Hashing**: User passwords are securely hashed using bcrypt with a salt round of 10, ensuring no plain-text passwords are stored in the database.

### 2. Token-Based Authentication
- **JWT (JSON Web Tokens)**: Each user is issued a short-lived JWT (24 hours) containing user-specific information. JWTs allow secure user authentication without storing state on the server.

### 3. Session Management and CSRF Protection
- **Sessions Map**: An in-memory session map stores a random CSRF token (session ID) tied to the user session. Only requests containing this token are accepted, ensuring requests originate from authenticated sessions.
- **Session Invalidation**: If suspicious activity is detected, the user’s session entry can be removed from the map, immediately terminating their access without waiting for token expiry.

### 4. Input Validation
- **Server-side Validation**: Validates email format, password length, and checks for empty field submissions to prevent injection attacks and enforce data integrity.

### 5. CORS and Cookie Security
- **Strict CORS Configuration**: Limits API access to specific origins, preventing unauthorized cross-origin requests.
- **Secure Cookie Settings**: HTTP-only, secure, and SameSite flags are used to protect cookies, preventing client-side access and CSRF attacks.

### 6. Middleware Authentication
- **Protected Routes**: Uses middleware to verify tokens and session status, ensuring only authenticated users can access protected resources.

## Security Implementation Details

### Password Hashing with Bcrypt
User passwords are hashed using bcrypt with a salt round of 10 before being stored. This hashing prevents storage of plain-text passwords, adding a layer of security even if the database is compromised.

### JWT-based Authentication
Once a user logs in, a JWT is issued. This token includes user-specific information and expires after 24 hours, requiring re-authentication to access protected routes after the expiry period.

### CSRF Protection with Custom Session Management
To protect against CSRF attacks, a random session ID is generated and stored in an in-memory Map as part of each user session. This session ID acts as a CSRF token, verifying each request made by the user:

- **Request Verification**: Only requests containing the correct session ID (CSRF token) are processed, ensuring they originate from authenticated sessions.
- **Immediate Access Control**: If a user performs suspicious actions, their session ID can be removed from the map, immediately terminating their session. This provides real-time control over access without waiting for the token or session to expire.

### Input Validation
Server-side validation is implemented to check email format, password length, and prevent empty field submissions. This reduces the risk of injection attacks, enforcing data integrity and enhancing security.

### CORS and Cookie Security
- **CORS**: Configured to restrict API access to specific origins.
- **Secure Cookies**: Cookies are flagged with HttpOnly, Secure, and SameSite attributes to protect session data.

## Usage
- **Register**: Sends user data to the `/signup` endpoint, where the password is hashed and stored securely in the database.
- **Login**: Validates user credentials and issues a JWT upon successful login.
- **Session Validation**: Each request is verified with a session ID stored in the Map. Suspicious sessions can be removed from the Map to prevent unauthorized access.

## Potential Vulnerabilities & Mitigations
- **CSRF Attacks**: Mitigated using a custom CSRF token stored in the session map, allowing real-time session control.
- **XSS Attacks**: Prevented through input validation and encoding, ensuring sanitized data handling.
- **Session Hijacking**: Minimized using secure cookie flags and strict session handling practices.
