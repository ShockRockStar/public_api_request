/********
 * Declare global variables. Need to store the public API, get DOM elements for the search-container, gallery, and body of the page 
 */
// variable for 5000 random User's Data
 const apiInfo = "https://randomuser.me/api/?results=12&nat=gb,us";
// store access to the search bar
 const searchField = document.querySelector(".search-container");
// store accedd to the gallery section
 const getGallery = document.getElementById("gallery");
// store access to the HTML body
 const pageBody = document.querySelector("body");

 /***
  * Create functions to pull data for users.
  */

  function getData(url){
      return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        // catch any errors in Async
        .catch(error=> console.log("There was a server issue", error));
  }

//Check status of network progress if okay, resolve the promise if bad, reject; send result to getData function
  function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText()));
  } 

  // Use asynchronous programming to fetch data and populate user data

  getData(apiInfo)
    .then(data => populateUsers(data.results))
    .then(search);

// Creates a page of randomly selected employees from the API
// create userCard, append to getGallery and create the HTML language that shows the info on an employee
function populateUsers(data){
    data
    .map((person, index) => {
        const userCard = document.createElement("div");
        getGallery.appendChild(userCard);
        userCard.className = "card";
        userCard.innerHTML = `<div class="card-img-container">
                        <img class="card-img" src=${person.picture.large} alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${person.name.first}, ${person.name.last}</h3>
                        <p class="card-text">${person.email}</p>
                        <p class="card-text cap">${person.location.city} , ${person.location.state}</p>
                    </div>`;

        userCard.addEventListener("click", event => {
            modalPopUp(data, index);
        });
    })
    // Remove commas
    .join("");

    return data;
}

/*Create a modal window, when any part of an employee item is clicked, a modal window pops up with the details:
**
*Image, Name, e-mail, city or location, cell number, detailed address, birthday.
*There is a way to CLOSE the modal window
*/

//modal window
function modalPopUp(data, personIndex){
    const person = data[personIndex];
    const { date } = person.dob;
    let dob = date.split("T")[0];
    dob = dob
        .split("-")
        .reverse()        
        .join("/");

const modalWindow = document.createElement("div");
// append Modal markup to the webpage
pageBody.appendChild(modalWindow);

modalWindow.className = "modal-container";

modalWindow.innerHTML = `<div class="modal">
<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
<div class="modal-info-container">
    <img class="modal-img" src=${person.picture.large} alt="profile picture">
    <h3 id="name" class="modal-name cap">${person.name.first}, ${person.name.last}</h3>
    <p class="modal-text">${person.email}</p>
    <p class="modal-text cap">${person.location.city}</p>
    <hr>
    <p class="modal-text">${person.cell}</p>
    <p class="modal-text">${person.location.street.name}, ${person.location.city}, ${person.location.postcode}</p>
    <p class="modal-text">${dob}</p>
</div>`;



// get model close button and add functionality to close that modal

const modalExit = document.getElementById("modal-close-btn");
    modalExit.addEventListener("click", event=> {
        modalWindow.remove();
    })


// Add Next and Previous functionality to the modal

const modalButtons = document.createElement("div");
    modalButtons.className = "modal-btn-container";


// Add the newly created modal buttons to the modal with appendChild and innerHTML
modalWindow.appendChild(modalButtons);
modalButtons.innerHTML = ` <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
<button type="button" id="modal-next" class="modal-next btn">Next</button>`;

// Adding the buttons to the modal

const next = document.getElementById("modal-next");
const prev = document.getElementById("modal-prev");

    // if there is a valid index value for the next employee
    if(data[personIndex + 1] != null) {
        next.style.display = " ";
    } else {
        next.style.display = "none";
    }
    // if there is a valid index value for the previous employee
    if(data[personIndex -1] != null) {
        prev.style.display = " ";
    } else {
        prev.style.display = "none";
    }

    next.addEventListener("click", event => {
        modalWindow.remove();
        modalPopUp(data, personIndex + 1);
    });

    prev.addEventListener("click", event => {
        modalWindow.remove();
        modalPopUp(data, personIndex -1);
    });
}

// Write function for the searchbar

function search() {
    const searchBar = document.createElement("form");
        searchBar.action = "#";
        searchBar.method = "get";
        searchBar.innerHTML = `<input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`;


// Add search field to HTML

searchField.appendChild(searchBar);

const userCard = document.querySelectorAll(".card");
const searchInfo = document.getElementById("search-input");
const searchButton = document.getElementById("search-submit");

// Make the search button work
function employeeSearch(searchInput, names) {
    const searchContent = searchInput.value;
    const input = searchContent.toString().toLowerCase();

    for(let i=0; i<names.length; i++) {
        const searchName = names[i].querySelector("h3");

        const stringSearch = searchName.textContent.toString().toLowerCase();

        const matched = stringSearch.indexOf(input);

        if(matched !== -1){
            names[i].style.display = "";
        } else {
            names[i].style.display = "none";
        }
    }
}

// Submit Button Event handler
searchButton.addEventListener("click", event => {
    event.preventDefault();
    employeeSearch(searchInfo, userCard);
});

// Allow search from key presses, add event listener keyup, pass in employeeSearch function & arguments, searchInfo/userCard
searchInfo.addEventListener("keyup", () => {
    employeeSearch(searchInfo, userCard);
})
};

//Add some CSS color to the page 
const addCSS = s =>(d=>{d.head.appendChild(d.createElement("style")).innerHTML=s})(document);

// Usage for CSS
addCSS(`body{ background:rgb(208, 248, 248); }
        .card{ background:rgb(208, 248, 248); }`
)