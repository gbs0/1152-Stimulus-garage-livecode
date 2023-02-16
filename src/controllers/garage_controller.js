import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["carsList"]

  connect() {
    console.log("hello from garage controller!")
    this.fetchCars()
  }

  fetchCars() {
    fetch("https://wagon-garage-api.herokuapp.com/wagon/cars")
      .then(response => response.json())
      .then(data => this.insertCar(data))
  }

  insertCar(data) {
    this.carsListTarget.innerHTML = ""
    data.forEach((car) => {
      const carDiv = `<div class="car">
        <div class="car-image">
          <img src="http://loremflickr.com/280/280/${car.brand}%20${car.model}" />
        </div>
        <div class="car-info">
          <h4>${car.brand} ${car.model}</h4>
          <p><strong>Owner:</strong> ${car.owner}</p>
          <p><strong>Plate:</strong> ${car.plate}</p>
        </div>
        <a href="" data-action="click->garage#deleteCar" value="${car.id}">Delete Car</a>
      </div>
      `
      this.carsListTarget.insertAdjacentHTML('beforeend', carDiv)
    }) 
  }

  createCar(event) {
    event.preventDefault()
    console.log(event.currentTarget)
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    fetch("https://wagon-garage-api.herokuapp.com/wagon/cars", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => this.fetchCars())
  }

  deleteCar(event) {
    event.preventDefault()
    fetch(`https://wagon-garage-api.herokuapp.com/wagon/cars/${event.currentTarget.attributes.value.value}`, {
      method: "DELETE"
    })
    .then(
      () => this.fetchCars()
    )
  }
}
