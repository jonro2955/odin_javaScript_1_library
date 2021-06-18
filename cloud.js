class Book {
  constructor(title, author, pages, url, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.url = url;
    this.read = read;
  }
}

const sampleBooks = {
  "books": [{
    "title": "Sample Book 1: The Code Breaker: Jennifer Doudna, Gene Editing, and the Future of the Human Race",
    "author": "Walter Isaacson",
    "pages": 560,
    "url": "https://www.amazon.com/dp/1982115858?tag=NYTBSREV-20&tag=NYTBSREV-20",
    "read": true
  }, {
    "title": "Sample Book 2: The Sum of Us: What Racism Costs Everyone and How We Can Prosper Together",
    "author": "Heather McGhee",
    "pages": 448,
    "url": "https://www.amazon.com/dp/0525509569?tag=NYTBSREV-20&tag=NYTBSREV-20",
    "read": true
  }, {
    "title": "Sample Book 3: Greenlights",
    "author": "Matthew McConaughey",
    "pages": 304,
    "url": "https://www.amazon.com/dp/0593139135?tag=NYTBSREV-20&tag=NYTBSREV-20",
    "read": true
  }]
}

//firebase setup
var firebaseConfig = {
  apiKey: "AIzaSyBoxV-TQFc4CXXhQmjOPkE5jyUoJXHLN-A",
  authDomain: "odin-library-1075e.firebaseapp.com",
  projectId: "odin-library-1075e",
  storageBucket: "odin-library-1075e.appspot.com",
  messagingSenderId: "653278230347",
  appId: "1:653278230347:web:da1d3f4ede3500b06a9ace",
  measurementId: "G-TV0R20H5LQ"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const cloudBooksRef = firebase.database().ref().child('books');

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

//editor close button
const editorCloseBtn = document.querySelector("#editorCloseBtn");
editorCloseBtn.addEventListener("click", () => {
  document.querySelector("#bookEditor").style.display = "none";
});

//on submitNewBtn click: create a new book and push it into firebase
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
  if(newTitle != "" && newAuthor != ""){
    let newBook = new Book(newTitle, newAuthor, newPages, newURL, newStatus);
    cloudBooksRef.push(newBook);
    displayStorage();
    closeCreator();
  } else {
    alert("Please fill out the 'Title' and 'Author' fields to continue.")
  }
});

// Clear All button 
const clearAll = document.querySelector("#clearAll");
clearAll.addEventListener("click", () => {
  firebase.database().ref().remove();
  displayStorage();
});

// 3 sample reload button 
const sample3ResetBtn = document.querySelector("#sample3Reset");
sample3ResetBtn.addEventListener("click", () => {
  firebase.database().ref().set(sampleBooks);
  displayStorage();
});

//remove all visual elements in the html #table element
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

//populates editor fields with given cloudObjectKey
function populateEditor(cloudObjectKey){
  cloudBooksRef.on("value", booksRef => { //access firebase
    booksRef.forEach((currentBook) => { 
      if(currentBook.key == cloudObjectKey){
        document.querySelector("#editorLabel").textContent = currentBook.val().title;
        document.querySelector("#editedTitle").value = currentBook.val().title;
        document.querySelector("#editedAuthor").value = currentBook.val().author;
        document.querySelector("#editedPages").value = currentBook.val().pages;
        document.querySelector("#editedURL").value = currentBook.val().url;
        if (currentBook.val().read === true){
          document.querySelector("#editedStatus").checked = true;
        } else {
          document.querySelector("#editedStatus").checked = false;
        };  
      }
    });
  });
}

//updates given cloud object using editor inputs
function submitEdit(cloudObjectKey){
  console.log(`Submit edit button key: ${cloudObjectKey}`);
  editedBook = {}; //trying alternative to using constructor
  editedBook["title"] = document.querySelector("#editedTitle").value;
  editedBook["author"] = document.querySelector("#editedAuthor").value;
  editedBook["pages"] = document.querySelector("#editedPages").value;
  editedBook["url"] = document.querySelector("#editedURL").value;
  editedBook["read"] = document.querySelector("#editedStatus").checked ? true : false;
  const currentBookRef = firebase.database().ref().child(`books/${cloudObjectKey}`);
  currentBookRef.update(editedBook);
  document.querySelector("#bookEditor").style.display = "none"; 
}

//displays all books from cloud and creates interaction buttons to alter each book
function displayStorage(){
  clearTable();
  cloudBooksRef.on("value", booksRef => { //access firebase 
    booksRef.forEach((currentBook) => { 
      //container to put sub-divs inside for visual representation
      const newBookDiv = document.createElement("div");
      newBookDiv.setAttribute("class", "book");
      const table = document.querySelector("#table");
      table.appendChild(newBookDiv);
      //append sub-div for title
      const newTitleDiv = document.createElement("div");
      newTitleDiv.setAttribute("class", "attribute");
      newTitleDiv.textContent = currentBook.val().title; //get firebase object property
      newBookDiv.appendChild(newTitleDiv);
      //append sub-div for author
      const newAuthorDiv = document.createElement("div");
      newAuthorDiv.setAttribute("class", "attribute");
      newAuthorDiv.textContent = currentBook.val().author; //get firebase object property
      newBookDiv.appendChild(newAuthorDiv);
      //append sub-div for pages 
      const newPagesDiv = document.createElement("div");
      newPagesDiv.setAttribute("class", "attribute");
      newPagesDiv.textContent = currentBook.val().pages; //get firebase object property
      newBookDiv.appendChild(newPagesDiv);
      //append sub-div for URL 
      const newUrlDiv = document.createElement("div");
      newUrlDiv.setAttribute("class", "attribute");
      let myURL = currentBook.val().url; //get firebase object property
      if (myURL != ""){ 
        newUrlDiv.innerHTML = `<a target="blank" href=${myURL}>Web Link</a>`; 
      } 
      newBookDiv.appendChild(newUrlDiv);
      //append read status changer button 
      const readBtn = document.createElement("button");
      readBtn.setAttribute("class", "bookEntryBtns");
      newBookDiv.appendChild(readBtn);
      if (currentBook.val().read === true){  //get firebase object property
        readBtn.textContent = "Yes";
      } else {
        readBtn.textContent = "No";
      }
      readBtn.addEventListener("click", () => {
        /**To edit a single property of an object: (1)Create a new object 
         * containing just the property you want to change. (2)Create a reference 
         * to the currentBook's properties at its key level. (3)update using 
         * reference.update(new object)*/
        editedReadProperty = {};
        if (currentBook.val().read === true){  //get firebase object property
          editedReadProperty["read"] = false;
        } else {
          editedReadProperty["read"] = true;
        }
        const currentBookRef = firebase.database().ref().child(`books/${currentBook.key}`);
        currentBookRef.update(editedReadProperty);
        displayStorage();
      });
      //append edit button 
      const editBtn = document.createElement("button");
      newBookDiv.appendChild(editBtn);  
      editBtn.setAttribute("class", "bookEntryBtns");
      editBtn.setAttribute("objectKey", currentBook.key);
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", (e) => {
        let myKey = e.target.getAttribute("objectKey");
        document.querySelector("#bookEditor").style.display = "flex"; 
        populateEditor(myKey); 
        const submitEditBtn = document.querySelector("#submitEditBtn");
        submitEditBtn.setAttribute("objectKey", myKey);
        submitEditBtn.addEventListener("click", (e) => {
          submitEdit(e.target.getAttribute("objectKey"));
          displayStorage();
        });
      });
      //append delete button 
      const deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("class", "bookEntryBtns");
      deleteBtn.setAttribute("objectKey", currentBook.key);
      newBookDiv.appendChild(deleteBtn);  
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", (e) => {
        let myKey = e.target.getAttribute("objectKey");
        const currentBookRef = firebase.database().ref().child('books/' + myKey);
        currentBookRef.remove();
        displayStorage();
      });
    });  
  });
}

displayStorage();


