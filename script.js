'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const sortBtn = document.querySelector('.btn__sort');

class Workout {
  coords;
  distance;
  duration;
  date = new Date();
  id = (Date.now() + '').slice(-10);
  marker;

  constructor(coords, distance, duration) {
    this.coords = coords; //[lat , lng]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }
  setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDay()}`;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.type = 'running';
    this.setDescription();
    this.calcPace();
  }

  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.type = 'cycling';
    this.setDescription();
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / this.duration / 60;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cyc1 = new Cycling([39, -12], 27, 95, 523);

////////////////////////////////////////////////
//Application Architechture
class App {
  #map;
  #mapEvent;
  #workout = [];
  //constructor
  constructor() {
    //get position
    this.#getPosition();
    //load data
    this.loadLocalStorage();
    //event listeners
    form.addEventListener('submit', this.#newWorkout.bind(this));
    inputType.addEventListener('change', this.#toggleElevationFeild.bind(this));
    containerWorkouts.addEventListener('click', this.moveToPopup.bind(this));
    sortBtn.addEventListener('click', this.sort.bind(this));
  }

  //get position
  #getPosition() {
    //failure call back
    const failureCallback = function () {
      alert('Could not get your position');
    };

    navigator.geolocation.getCurrentPosition(
      this.#loadMap.bind(this),
      failureCallback,
    );
  }

  //success call back
  #loadMap(position) {
    const { latitude, longitude } = position.coords;

    this.#map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    //event handler for the map
    this.#map.on('click', this.#showForm.bind(this));

    //load saved localData markers
    this.#workout.forEach(w => this.renderWorkoutMarker(w));
  }

  //show form
  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  //hide form
  #hideForm() {
    // prettier-ignore
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  // toggle elevation
  #toggleElevationFeild() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  //new workout
  #newWorkout(e) {
    //validation function
    const validateInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let workout;

    //if workout running, create running obj
    if (type === 'running') {
      const cadence = +inputCadence.value;

      //check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validateInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('input has to be a positive number');
      workout = new Running(
        [this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng],
        distance,
        duration,
        cadence,
      );
    }

    //if workout cycling, create cycling obj
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      //check if data is valid
      if (
        !validateInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('input has to be a positive number');
      workout = new Cycling(
        [this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng],
        distance,
        duration,
        elevation,
      );
    }
    this.#workout.push(workout);

    // Display Marker on map
    this.renderWorkoutMarker(workout);

    //Display the workout on form list
    this.renderMapToList(workout);

    // hide form
    this.#hideForm();

    //add item to local storage
    this.setlocalStorage();
  }

  renderWorkoutMarker(workout) {
    const [lat, lng] = workout.coords;
    workout.marker = L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        `${workout.type === 'running' ? '🏃' : '🚴'}${workout.description}`,
        {
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        },
      )
      .openPopup();
  }

  renderMapToList(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <button class="workout__delete">🗑️</button>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚴'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout.type === 'running')
      html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

    if (workout.type === 'cycling')
      html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;

    form.insertAdjacentHTML('afterend', html);
  }

  moveToPopup(e) {
    // Handle delete button clicks
    if (e.target.classList.contains('workout__delete')) {
      e.stopPropagation();
      this.deleteWorkout(e);
      return;
    }

    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workout.find(w => w.id === workoutEl.dataset.id);

    this.#map.setView(workout.coords, 15, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  setlocalStorage() {
    localStorage.setItem(
      'workouts',
      JSON.stringify(this.#workout, (key, value) => {
        // Exclude the marker property from serialization
        if (key === 'marker') return undefined;
        return value;
      }),
    );
  }

  loadLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workout = data.map(w => {
      if (w.type === 'running') {
        return new Running(w.coords, w.distance, w.duration, w.cadence);
      }
      if (w.type === 'cycling') {
        return new Cycling(w.coords, w.distance, w.duration, w.elevationGain);
      }
    });
    this.#workout.forEach(w => this.renderMapToList(w));
  }

  deleteWorkout(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workoutId = workoutEl.dataset.id;
    const workout = this.#workout.find(w => w.id === workoutId);

    // Remove marker from map
    if (workout && workout.marker) {
      workout.marker.remove();
    }

    // Remove from array
    this.#workout = this.#workout.filter(w => w.id !== workoutId);

    // Remove from DOM
    workoutEl.remove();

    // Update localStorage
    this.setlocalStorage();
  }

  sort() {
    // Sort workouts by distance
    this.#workout.sort((a, b) => a.distance - b.distance);
    document.querySelectorAll('.workout').forEach(el => el.remove());
    this.#workout.forEach(w => this.renderMapToList(w));
  }
}

const app = new App();
