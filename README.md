Mapty — Workout Tracking Application

A sophisticated workout tracking application built with modern JavaScript, demonstrating advanced Object-Oriented Programming (OOP), clean architecture principles, and seamless integration with browser APIs.

This project reflects strong frontend engineering fundamentals, scalable architecture design, and production-quality application logic.

Overview

Mapty allows users to log running and cycling workouts directly on an interactive map. The application manages state efficiently, persists data across sessions, and provides smooth UI interactions without relying on external frameworks.

Key Features

Interactive map tracking — Click anywhere on the map to log a workout

Dynamic form behavior — Automatically switches between Cadence (Running) and Elevation (Cycling)

Persistent data storage — Workouts saved using Local Storage

List-to-map navigation — Clicking a workout pans the map smoothly to its location

Workout deletion — Remove specific workouts

Sorting functionality — Sort workouts by distance

Architecture & Technical Implementation
Advanced Object-Oriented Programming
Class Hierarchy

The project uses a structured class-based design:

Workout (Base Class)

Running (Subclass)

Cycling (Subclass)

Inheritance & Method Overriding

Running calculates pace

Cycling calculates speed

Subclasses override specific methods to handle discipline-specific logic

Encapsulation

Modern ES6 private class fields are used to protect internal state:

#map
#workouts


Private methods ensure internal logic remains controlled and inaccessible from outside the class.

Centralized Application Controller

A dedicated App class:

Manages overall application state

Coordinates map interactions

Handles form submissions

Controls rendering logic

Manages data persistence

This separation of concerns ensures maintainability and scalability.

Context Management

The this keyword is carefully managed using .bind() to maintain proper method context in event listeners, avoiding common JavaScript pitfalls.

Asynchronous Features & Web APIs
Geolocation API

Retrieves user coordinates on application load

Provides a personalized initial map position

Leaflet.js Integration

Renders interactive maps

Adds custom markers

Displays dynamic popups

Implements smooth map animations

Local Storage API

Persists workout data

Restores workouts on page reload

Maintains application state across sessions

Functional Programming Patterns

The project makes extensive use of high-order array methods:

map()

filter()

find()

every()

sort()

These are used for:

Data transformation

Validation

Rendering logic

State management

Event Delegation

Efficient handling of dynamic UI elements through event delegation, including:

Workout selection

Deleting workouts

Map panning interactions

Input Validation

Robust validation logic implemented using:

Rest parameters

Reusable utility functions

Functional programming techniques

Technologies Used

HTML5

CSS3

Modern JavaScript (ES6+)

Geolocation API

Local Storage API

Leaflet.js

Conceptual Structure
App
 ├── Workout (Base Class)
 │     ├── Running
 │     └── Cycling
 ├── Map Management
 ├── Form Handling
 ├── Data Persistence
 └── Event Handling

What This Project Demonstrates

Strong understanding of modern JavaScript

Advanced OOP principles in practice

Clean, modular architecture

Real-world API integration

State management without frameworks

Maintainable and scalable frontend design
