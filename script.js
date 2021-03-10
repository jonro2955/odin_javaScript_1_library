let myLibrary = [];

//Book constructor
function Book(title, author, pages, url, read){
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.url = url;
  this.read = read;
}

Book.prototype.showInfo = function(){
  alert(`Book info: ${this.title} by ${this.author}, ${this.pages} pages, found at 
  ${this.url}, ${(this.read) ? "read" : "not read yet"}.`);
}

Book.prototype.toggleRead = function(){
  if(this.read){
    this.read = false;
  } else {
    this.read = true;
  }
}

function clearTable(){
  const table = document.querySelector("#table");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function closeCreator(){
  document.getElementById("newTitle").value = "";
  document.getElementById("newAuthor").value = "";
  document.getElementById("newPages").value = "";
  document.getElementById("newLink").value = "";
  document.getElementById("newStatus").checked = false;
  document.querySelector("#bookCreator").style.display = "none";
}

//a function that detects whether localStorage is supported and available
function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      console.log (x);
      storage.setItem(x, x);
      console.log(storage.getItem(x));
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

//addBtn toggles the visibility of the book creator window
const addBtn = document.querySelector("#addBtn");
const bookCreator = document.querySelector("#bookCreator");
addBtn.addEventListener("click", () => {
  if (bookCreator.style.display != "flex"){
    bookCreator.style.display = "flex";
  } else {
    bookCreator.style.display = "none";
  }
});

//creatorCloseBtn makes the creator invisible and resets its fields
const creatorCloseBtn = document.querySelector("#creatorCloseBtn");
creatorCloseBtn.addEventListener("click", () => {
  closeCreator();  
});


/*when the book creator's submit button is clicked, create a book using
the input values, push it into the array, and update the storage*/
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", () => {
  let newTitle = document.getElementById("newTitle").value; //title: string
  let newAuthor = document.getElementById("newAuthor").value; //author: string
  let newPages = document.getElementById("newPages").value; //pages: number
  let newLink = document.getElementById("newLink").value; //url: string
  let readStatus; //read status: boolean
  if (document.getElementById("newStatus").checked){
    readStatus = true;
  } else {
    readStatus = false;
  }
  //only create if the first 2 fields are filled
  if(newTitle != "" && newAuthor != ""){
    let newBook = new Book(newTitle, newAuthor, newPages, newLink, readStatus);
    myLibrary.push(newBook);
    updateLocalStorage();
    updateDisplay();
    closeCreator();
  } else {
    alert("Please fill out the 'Title' and 'Author' fields to continue.")
  }
});

function updateDisplay() {
  //first, clear all existing elements in the table 
  clearTable();
  //for each book in myLibrary with index i, do the following:
  myLibrary.forEach((book, i) => {
    /*Create a container div for each book and append it to the table. This is to achieve 
    proper appearance in html. The book's details will go inside as separate divs*/
    const newBookDiv = document.createElement("div");
    newBookDiv.setAttribute("class", "book");
    table.appendChild(newBookDiv);   
    //create a sub div for the title and append it to the newBookDiv
    const newTitleDiv = document.createElement("div");
    newTitleDiv.textContent = localStorage.getItem(`book${i}-title`); /*from localStorage*/
    newTitleDiv.setAttribute("class", "attribute");
    newTitleDiv.setAttribute("id", `book${i}-title`);
    newBookDiv.appendChild(newTitleDiv);
    //create a sub div for the author and append it to the newBookDiv
    const newAuthorDiv = document.createElement("div");
    newAuthorDiv.textContent = localStorage.getItem(`book${i}-author`); /*from localStorage*/
    newAuthorDiv.setAttribute("class", "attribute");
    newAuthorDiv.setAttribute("id", `book${i}-author`);
    newBookDiv.appendChild(newAuthorDiv);
    //create a sub div for the pages and append it to the newBookDiv
    const newPagesDiv = document.createElement("div");
    newPagesDiv.textContent = localStorage.getItem(`book${i}-pages`);  /*from localStorage*/
    newPagesDiv.setAttribute("class", "attribute");
    newPagesDiv.setAttribute("id", `book${i}-pages`);
    newBookDiv.appendChild(newPagesDiv);
    //create a sub div for the URL and append it to the newBookDiv
    const newUrlDiv = document.createElement("div");
    let myURL = localStorage.getItem(`book${i}-url`); /*from localStorage*/
    if (myURL != ""){
      newUrlDiv.innerHTML = `<a target="blank" href=${myURL}>${myURL}</a>`;  
    }
    newUrlDiv.setAttribute("class", "attribute");
    newUrlDiv.setAttribute("id", `book${i}-url`);
    newBookDiv.appendChild(newUrlDiv);
    //append a read status button to newBookDiv
    const readBtn = document.createElement("button");
    newBookDiv.appendChild(readBtn);
    readBtn.setAttribute("class", "bookEntryBtns");
    readBtn.setAttribute("id", `book${i}-read`);
    if (localStorage.getItem(`book${i}-read`) === "true"){  /*from localStorage*/
      readBtn.textContent = "Yes";
    } else {
      readBtn.textContent = "No";
    }
    readBtn.addEventListener("click", () => {
      /*anytime a myLibrary object is changed or deleted, update the the local storage 
      and update the display*/
      book.toggleRead();
      updateLocalStorage();
      updateDisplay();
    });
    //append a delete button to newBookDiv 
    const deleteBtn = document.createElement("button");
    newBookDiv.appendChild(deleteBtn);  
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("class", "bookEntryBtns");
    //associate an array index number to each delete button
    deleteBtn.setAttribute("data-index", i); 
    deleteBtn.addEventListener("click", () => {
      //"deleteBtn.dataset.index" returns the data-index value of this deleteBtn
      myLibrary.splice(deleteBtn.dataset.index, 1); //splice to remove 1 book at index
      updateLocalStorage();
      updateDisplay();
    });
  });
}

/*create a function that goes through each book in myLibrary and saves to localStorage
the id-value pairs of each book's attibute 
*/
function updateLocalStorage(){
  localStorage.clear();
  myLibrary.forEach((book, index) => {
    localStorage.setItem(`book${index}-title`, book.title);
    localStorage.setItem(`book${index}-author`, book.author);
    localStorage.setItem(`book${index}-pages`, book.pages);
    localStorage.setItem(`book${index}-url`, book.url);
    localStorage.setItem(`book${index}-read`, book.read);
  });
}

//sample books for testing
let sampleBook0 = new Book("sampleBook0", "Author0", 256, "https://www.amazon.com/", true);
let sampleBook1 = new Book("sampleBook1", "Author1", 321, "https://www.amazon.com/", false);
let sampleBook2 = new Book("sampleBook2", "Author2", 456, "https://www.barnesandnoble.com/", false);
myLibrary.push(sampleBook0);
myLibrary.push(sampleBook1);
myLibrary.push(sampleBook2);
updateLocalStorage();
updateDisplay();

