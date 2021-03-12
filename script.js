let myLibrary = [];
let firstLoad = true;

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

//addBtn toggles visibility of the book creator window 
const addBtn = document.querySelector("#addBtn");
const bookCreator = document.querySelector("#bookCreator");
addBtn.addEventListener("click", () => {
  if (bookCreator.style.display != "flex"){
    bookCreator.style.display = "flex";
    //put cursor on "newTitle" input element
    document.getElementById("newTitle").focus();
  } else {
    bookCreator.style.display = "none";
  }
});

//creatorCloseBtn clears all fields and closes the creator
const creatorCloseBtn = document.querySelector("#creatorCloseBtn");
creatorCloseBtn.addEventListener("click", () => {
  closeCreator();  
});

/*book creator submit button: when clicked, create a book using the inputs, 
push it into the array, update the storage, and update the display*/
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", () => {
  let newTitle = document.getElementById("newTitle").value; //string
  let newAuthor = document.getElementById("newAuthor").value; //string
  let newPages = document.getElementById("newPages").value; //number
  let newURL = document.getElementById("newURL").value; //string
  let newStatus; //boolean
  if (document.getElementById("newStatus").checked){
    newStatus = true;
  } else {
    newStatus = false;
  }
  //only create if the first 2 fields are filled
  if(newTitle != "" && newAuthor != ""){
    let newBook = new Book(newTitle, newAuthor, newPages, newURL, newStatus);
    myLibrary.push(newBook);
    synchStorageToLibrary(); //always synchStorageToLibrary when myLibrary changes
    displayStorage(); //always displayStorage when local storage is updated
    closeCreator();
  } else {
    alert("Please fill out the 'Title' and 'Author' fields to continue.")
  }
});

//cleanReset button 
const cleanReset = document.querySelector("#cleanReset");
cleanReset.addEventListener("click", () => {
  localStorage.clear();
  myLibrary = [];
  clearTable()
});

//sample3Reset button 
const sample3Reset = document.querySelector("#sample3Reset");
sample3Reset.addEventListener("click", () => {
  localStorage.clear();
  myLibrary = [];
  initialize();
});

//function to remove all visual elements in the html #table
function clearTable(){
  const table = document.querySelector("#table");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

//function to close the creator form div and clears its fields
function closeCreator(){
  document.getElementById("newTitle").value = "";
  document.getElementById("newAuthor").value = "";
  document.getElementById("newPages").value = "";
  document.getElementById("newURL").value = "";
  document.getElementById("newStatus").checked = false;
  document.querySelector("#bookCreator").style.display = "none";
}


//function to synchronize localStorage to myLibrary array
function synchStorageToLibrary(){
  localStorage.clear();
  myLibrary.forEach((book, index) => {
    localStorage.setItem(`book${index}-title`, book.title);
    localStorage.setItem(`book${index}-author`, book.author);
    localStorage.setItem(`book${index}-pages`, book.pages);
    localStorage.setItem(`book${index}-url`, book.url);
    localStorage.setItem(`book${index}-read`, book.read);
    localStorage.setItem(`numberOfBooks`, myLibrary.length);
  });
}

//function to synchronize myLibrary array to localStorage 
function synchMyLibraryToStorage(){
  let booksToReinsert = localStorage.getItem("numberOfBooks");
  for (let i = 0;  i < booksToReinsert; i++){
    let title = localStorage.getItem(`book${i}-title`);
    let author = localStorage.getItem(`book${i}-author`);
    let pages = localStorage.getItem(`book${i}-pages`);
    let url = localStorage.getItem(`book${i}-url`);
    let read;
    if(localStorage.getItem(`book${i}-read`) === "true"){
      read = true;
    } else {
      read = false;
    }   
    let book = new Book(title, author, pages, url, read);
    myLibrary.push(book);  
  }
}

//function to display books stored in localStorage 
function displayStorage(){
  clearTable(); 
  let numberOfBooks = localStorage.getItem(`numberOfBooks`);
  if(numberOfBooks > 0){
    for (let i = 0;  i < numberOfBooks; i++){
      //make a container to put divs inside for visual presentation
      const newBookDiv = document.createElement("div");
      newBookDiv.setAttribute("class", "book");
      table.appendChild(newBookDiv);
      //append a sub div for the title
      const newTitleDiv = document.createElement("div");
      newTitleDiv.setAttribute("class", "attribute");
      newTitleDiv.textContent = localStorage.getItem(`book${i}-title`); //access the precise item from localStorage
      newBookDiv.appendChild(newTitleDiv);
      //append a sub div for the author 
      const newAuthorDiv = document.createElement("div");
      newAuthorDiv.setAttribute("class", "attribute");
      newAuthorDiv.textContent = localStorage.getItem(`book${i}-author`); //access the precise item from localStorage
      newBookDiv.appendChild(newAuthorDiv);
      //append a sub div for the pages 
      const newPagesDiv = document.createElement("div");
      newPagesDiv.setAttribute("class", "attribute");
      newPagesDiv.textContent = localStorage.getItem(`book${i}-pages`); //access the precise item from localStorage
      newBookDiv.appendChild(newPagesDiv);
      //append a sub div for the URL 
      const newUrlDiv = document.createElement("div");
      newUrlDiv.setAttribute("class", "attribute");
      let myURL = localStorage.getItem(`book${i}-url`); //access the precise item from localStorage
      if (myURL != ""){
        newUrlDiv.innerHTML = `<a target="blank" href=${myURL}>Link</a>`;  
      }
      newBookDiv.appendChild(newUrlDiv);
      //append read status button 
      const readBtn = document.createElement("button");
      readBtn.setAttribute("class", "bookEntryBtns");
      newBookDiv.appendChild(readBtn);
      readBtn.setAttribute("class", "bookEntryBtns");
      if (localStorage.getItem(`book${i}-read`) === "true"){  //access the precise item from localStorage
        readBtn.textContent = "Yes";
      } else {
        readBtn.textContent = "No";
      }
      readBtn.addEventListener("click", () => {
        myLibrary[i].toggleRead();
        synchStorageToLibrary();
        displayStorage();
      });
      //append delete button 
      const deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("class", "bookEntryBtns");
      newBookDiv.appendChild(deleteBtn);  
      deleteBtn.textContent = "Delete";
      //associate a data-index attribute to each delete button to link to array object
      deleteBtn.setAttribute("data-index", i); 
      deleteBtn.addEventListener("click", () => {
        //"deleteBtn.dataset.index" returns the data-index attribute of this deleteBtn
        myLibrary.splice(deleteBtn.dataset.index, 1); 
        synchStorageToLibrary();
        displayStorage();
      });
    }  
  }
}

//Initialize with 3 sample books on initial load
function initialize(){
  if(myLibrary.length === 0 && !localStorage.getItem("numberOfBooks")){ 
    console.log("Resetting with 3 samples. synchStorageToLibrary. displayStorage"); 
    let sampleBook1 = new Book("Harry Potter and the Philosopher's Stone", "J. K. Rowling", 256, "https://www.amazon.com/Harry-Potter-Philosophers-Stone-Rowling/dp/0747532699/ref=sr_1_1?dchild=1&keywords=0747532699&qid=1615483278&sr=8-1", true);
    let sampleBook2 = new Book("The Hobbit", "J. R. R. Tolkien", 310, "https://www.amazon.com/Hobbit-There-Again-Tolkien-Paperback/dp/B00OHXKIWG/ref=sr_1_6?crid=QGNW557WYSY&dchild=1&keywords=the+hobbit+book&qid=1615483956&sprefix=the+hobbit+%2Caps%2C251&sr=8-6", true);
    let sampleBook3 = new Book("The Da Vinci Code", "	Dan Brown", 689, "https://www.amazon.com/DaVinci-Brown-Hardcover-jacket-Copyrighted/dp/B003UI24DA/ref=sr_1_4?dchild=1&keywords=the+davinci+code+book&qid=1615484100&sr=8-4", false);
    myLibrary.push(sampleBook1);
    myLibrary.push(sampleBook2);
    myLibrary.push(sampleBook3);
    synchStorageToLibrary();
  } 
  /*Reloading clears myLibrary while there may still be books in memory.
  In such a case, you have to synchronize myLibrary to localStorage */
  if(myLibrary.length === 0 && localStorage.getItem("numberOfBooks") > 0){
    console.log("Refreshed. synchMyLibraryToStorage. displayStorage"); 
    synchMyLibraryToStorage()
  }
  displayStorage(); 
}

initialize();
