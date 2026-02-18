# Mapty — Workout Tracking Application

A workout tracking application built with modern JavaScript that allows users to log running and cycling workouts directly on an interactive map.

This project demonstrates clean architecture, advanced Object-Oriented Programming (OOP), and integration with browser APIs — without using any frontend frameworks.

---

## Overview

Mapty enables users to:

- Click on a map to log workouts
- Store workouts persistently in the browser
- Navigate from the workout list to its map location
- Manage workout entries dynamically

The application follows a structured, class-based architecture with clear separation of concerns.

---

## Features

### Interactive Map Tracking
Click anywhere on the map to add a workout at a specific location.

### Dynamic Form Behavior
The form automatically toggles between:

- **Cadence** (Running)
- **Elevation Gain** (Cycling)

### Workout Persistence
Workouts are saved using the `Local Storage API` and restored when the page reloads.

### List-to-Map Navigation
Clicking a workout in the sidebar smoothly pans the map to its exact coordinates.

### Workout Management
- Delete specific workouts
- Sort workouts by distance

---

## Architecture

The application is built using a class-based design:

```
Workout (Base Class)
│
├── Running (Subclass)
└── Cycling (Subclass)

App (Controller Class)
```

### Workout (Base Class)

Contains shared properties:

- `date`
- `id`
- `coords`
- `distance`
- `duration`

### Running & Cycling (Subclasses)

- Running calculates **pace**
- Cycling calculates **speed**
- Method overriding is used for workout-specific logic

### App (Controller Class)

Responsible for:

- Initializing the map
- Handling user interactions
- Rendering workouts
- Managing application state
- Persisting data to local storage

---

## Technical Concepts Applied

### Object-Oriented Programming (OOP)

- ES6 Classes
- Inheritance
- Method Overriding
- Encapsulation using private class fields:

```js
#map
#workouts
```

### State Management

Application state is managed within the `App` class to ensure maintainability and scalability.

### Context Handling

The `this` keyword is properly managed using:

```js
.bind(this)
```

to maintain correct method context in event listeners.

### High-Order Array Methods

Used for data transformation and logic:

- `map()`
- `filter()`
- `find()`
- `every()`
- `sort()`

### Event Delegation

Efficient handling of dynamically rendered elements such as:

- Workout selection
- Deleting workouts
- Map navigation

---

## Browser APIs & Libraries

### Geolocation API
Retrieves the user's current position to initialize the map.

### Leaflet.js
Handles:

- Interactive map rendering
- Custom markers
- Popups
- Smooth animations

### Local Storage API
Stores and restores workout data across sessions.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Geolocation API
- Local Storage API
- Leaflet.js

---

## How to Run the Project

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2. Open `index.html` in your browser.

No build tools or installations are required.

---

## Project Purpose

This project demonstrates strong JavaScript fundamentals, structured application design, and real-world browser API integration without relying on external frameworks.
