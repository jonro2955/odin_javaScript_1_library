/*This program uses the array libraryArray to store all book objects.
The use of this array is an unnecessary feature of the app which was an 
part of the original project instructions which remained as I morphed the 
app from a non-persistent state app to one that uses local
storage to become a persistent state app.

New book object entries are first inserted into this array, then the
local storage is updated to mirror this array immediately after each time 
the array or its contents are altered. Since the libraryArray is erased when 
the page is reloaded, at startup, the app's initialization function checks 
if there are books stored in local storage, and if so, synchronizes the 
array to mirror the books stored in memory. */

let libraryArray = [];

//constructor
function Book(title, author, pages, url, read){
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.url = url;
  this.read = read;
}

Book.prototype.edit = function(titleNew, authorNew, pagesNew, urlNew, readNew){
  this.title = titleNew;
  this.author = authorNew;
  this.pages = pagesNew;
  this.url = urlNew;
  this.read = readNew;
}

Book.prototype.toggleRead = function(){
  if(this.read){
    this.read = false;
  } else {
    this.read = true;
  }
}

//Control the visibility of the book creator window 
const addBtn = document.querySelector("#addBtn");
const bookCreator = document.querySelector("#bookCreator");
addBtn.addEventListener("click", () => {
  bookCreator.style.display = "flex";
  document.getElementById("newTitle").focus();
});
const creatorCloseBtn = document.querySelector("#creatorCloseBtn");
creatorCloseBtn.addEventListener("click", () => {
  closeCreator();  
});

/*book creator submit button: when clicked, creates a book using the input values, 
pushes it into the array, synchronizes the storage to the array, and updates the display*/
const submitNewBtn = document.querySelector("#submitNewBtn");
submitNewBtn.addEventListener("click", () => {
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
    libraryArray.push(newBook);
    synchStorageToLibrary(); //always synchStorageToLibrary when libraryArray changes
    displayStorage(); //always displayStorage when local storage is updated
    closeCreator();
  } else {
    alert("Please fill out the 'Title' and 'Author' fields to continue.")
  }
});

/*book edit button function: populate the edit form using the book at index in storage*/
function populateEditor(index){
  document.querySelector("#editorLabel").textContent = localStorage.getItem(`book${index}-title`);
  document.querySelector("#editedTitle").value = localStorage.getItem(`book${index}-title`);
  document.querySelector("#editedAuthor").value = localStorage.getItem(`book${index}-author`);
  document.querySelector("#editedPages").value = localStorage.getItem(`book${index}-pages`);
  document.querySelector("#editedURL").value = localStorage.getItem(`book${index}-url`);
  console.log(`${localStorage.getItem("book${index}-read")}`);
  if (localStorage.getItem(`book${index}-read`) == "true"){
    document.querySelector("#editedStatus").checked = true;
  } else {
    document.querySelector("#editedStatus").checked = false;
  };  
}

/*book editor submit button function: edit the indexed array book using the form values, 
synchronize the storage to the array, and update the display*/
function submitEdit(index){
  document.querySelector("#bookEditor").style.display = "none";
  let editedTitle = document.querySelector("#editedTitle").value;
  let editedAuthor = document.querySelector("#editedAuthor").value;
  let editedPages = document.querySelector("#editedPages").value;
  let editedURL = document.querySelector("#editedURL").value;
  let editedStatus;
  if (document.querySelector("#editedStatus").checked){
    editedStatus = true;
  } else {
    editedStatus = false;
  };
  libraryArray[index].edit(editedTitle, editedAuthor, editedPages, editedURL, editedStatus);
  synchStorageToLibrary();
  displayStorage();  
}

//wire up the editor close button
const editorCloseBtn = document.querySelector("#editorCloseBtn");
editorCloseBtn.addEventListener("click", () => {
  document.querySelector("#bookEditor").style.display = "none";
});

//cleanReset button 
const cleanReset = document.querySelector("#cleanReset");
cleanReset.addEventListener("click", () => {
  localStorage.clear();
  libraryArray = [];
  clearTable()
});

//3 sample reload button 
const sample3Reset = document.querySelector("#sample3Reset");
sample3Reset.addEventListener("click", () => {
  localStorage.clear();
  libraryArray = [];
  initialize();
});

//function to remove all visual elements in the html #table element
function clearTable(){
  const table = document.querySelector("#table");
  while (table.firstChild){
    table.removeChild(table.firstChild);
  }
}

//function to close the creator window and clear its fields
function closeCreator(){
  document.getElementById("newTitle").value = "";
  document.getElementById("newAuthor").value = "";
  document.getElementById("newPages").value = "";
  document.getElementById("newURL").value = "";
  document.getElementById("newStatus").checked = false;
  document.querySelector("#bookCreator").style.display = "none";
}

//function to synchronize localStorage to libraryArray array
function synchStorageToLibrary(){
  localStorage.clear();
  libraryArray.forEach((book, index) => {
    localStorage.setItem(`book${index}-title`, book.title);
    localStorage.setItem(`book${index}-author`, book.author);
    localStorage.setItem(`book${index}-pages`, book.pages);
    localStorage.setItem(`book${index}-url`, book.url);
    localStorage.setItem(`book${index}-read`, book.read);
    localStorage.setItem(`numberOfBooks`, libraryArray.length);
  });
}

//function to synchronize libraryArray array to localStorage 
function synchlibraryArrayToStorage(){
  for (let i = 0;  i < localStorage.getItem("numberOfBooks"); i++){
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
    libraryArray.push(book);  
  }
}

//function to display books stored in localStorage 
function displayStorage(){
  clearTable(); 
  let numberOfBooks = localStorage.getItem(`numberOfBooks`);
  const table = document.querySelector("#table");
  if(numberOfBooks > 0){
    for (let i = 0;  i < numberOfBooks; i++){
      //container to put sub-divs inside for visual presentation
      const newBookDiv = document.createElement("div");
      newBookDiv.setAttribute("class", "book");
      table.appendChild(newBookDiv);
      //append sub-div for the title
      const newTitleDiv = document.createElement("div");
      newTitleDiv.setAttribute("class", "attribute");
      newTitleDiv.textContent = localStorage.getItem(`book${i}-title`); //access the precise item from localStorage
      newBookDiv.appendChild(newTitleDiv);
      //append sub-div for the author
      const newAuthorDiv = document.createElement("div");
      newAuthorDiv.setAttribute("class", "attribute");
      newAuthorDiv.textContent = localStorage.getItem(`book${i}-author`); //access the precise item from localStorage
      newBookDiv.appendChild(newAuthorDiv);
      //append sub-div for the pages 
      const newPagesDiv = document.createElement("div");
      newPagesDiv.setAttribute("class", "attribute");
      newPagesDiv.textContent = localStorage.getItem(`book${i}-pages`); //access the precise item from localStorage
      newBookDiv.appendChild(newPagesDiv);
      //append sub-div for the URL 
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
      if (localStorage.getItem(`book${i}-read`) === "true"){  //access the precise item from localStorage
        readBtn.textContent = "Yes";
      } else {
        readBtn.textContent = "No";
      }
      readBtn.addEventListener("click", () => {
        libraryArray[i].toggleRead();
        synchStorageToLibrary();
        displayStorage();
      });
      //append edit button
      const editBtn = document.createElement("button");
      newBookDiv.appendChild(editBtn);  
      editBtn.setAttribute("class", "bookEntryBtns");
      editBtn.setAttribute("arrayIndex", i);
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", (e) => {
        //make editor visible
        document.querySelector("#bookEditor").style.display = "flex"; 
        //populate edit form with storage info for this specific book
        populateEditor(e.target.getAttribute("arrayIndex"));
        //wire up the submitEditBtn button for this specific book 
        document.querySelector("#submitEditBtn").addEventListener("click", () => {
          submitEdit(e.target.getAttribute("arrayIndex"));
        });
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
        libraryArray.splice(deleteBtn.dataset.index, 1); 
        synchStorageToLibrary();
        displayStorage();
      });
    }  
  }
}

//Initialize with 3 sample books at initial load
function initialize(){
  if(libraryArray.length === 0 && !localStorage.getItem("numberOfBooks")){ 
    console.log("Resetting with 3 samples. synchStorageToLibrary. displayStorage"); 
    let sampleBook1 = new Book("Sample Book 1: Harry Potter and the Philosopher's Stone", "J. K. Rowling", 256, "https://www.amazon.com/Harry-Potter-Philosophers-Stone-Rowling/dp/0747532699/ref=sr_1_1?dchild=1&keywords=0747532699&qid=1615483278&sr=8-1", true);
    let sampleBook2 = new Book("Sample Book 2: The Hobbit", "J. R. R. Tolkien", 310, "https://www.amazon.com/Hobbit-There-Again-Tolkien-Paperback/dp/B00OHXKIWG/ref=sr_1_6?crid=QGNW557WYSY&dchild=1&keywords=the+hobbit+book&qid=1615483956&sprefix=the+hobbit+%2Caps%2C251&sr=8-6", false);
    let sampleBook3 = new Book("Sample Book 3: The Da Vinci Code", "Dan Brown", 689, "https://www.amazon.com/DaVinci-Brown-Hardcover-jacket-Copyrighted/dp/B003UI24DA/ref=sr_1_4?dchild=1&keywords=the+davinci+code+book&qid=1615484100&sr=8-4", true);
    libraryArray.push(sampleBook1);
    libraryArray.push(sampleBook2);
    libraryArray.push(sampleBook3);
    synchStorageToLibrary();
  } 
  /*Reloading clears libraryArray, so synchronize libraryArray to localStorage */
  if(libraryArray.length === 0 && localStorage.getItem("numberOfBooks") > 0){
    console.log("Refreshed. synchlibraryArrayToStorage. displayStorage"); 
    synchlibraryArrayToStorage()
  }
  displayStorage(); 
}

initialize();
