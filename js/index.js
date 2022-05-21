// TODO: Fix flaw where it's not adding 'sam' to books that aren't liked by him already
// TODO: Fix flaw where 'sam' is still being added even if the same username is present

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event");

  listBooks();
});

function listBooks() {
  let listPanel = document.querySelector("#list-panel");

  fetch("http://localhost:3000/books", {
    method: "GET",
    header: {
      "Content-Type": "application/json"
    }
  })
    .then((response) => response.json())
    .then((objArray) => {
      console.log("objArray: ", objArray);
      objArray.forEach((obj) => {
        let newLi = document.createElement("li");
        let showDetailsButton = document.createElement("button");
        console.log("obj: ", obj);
        console.log("obj.title: ", obj.title);
        showDetailsButton.textContent = obj.title;
        showDetailsButton.id = obj.id;

        showDetailsButton.addEventListener("click", showDetails);

        newLi.append(showDetailsButton);
        listPanel.append(newLi);
      });
    })
    .catch((error) => {
      console.log("error: ", error.message);
    });
}

function showDetails(e) {
  let showPanelDiv = document.querySelector("#show-panel");
  console.log("showDetails() function called");
  console.log("e: ", e);
  console.log("e.target.parentElement.textContent: ", e.target.parentElement.textContent);
  // let bookTitle = e.target.parentElement.textContent;
  let bookId = e.target.id;
  // Make fetch() using 'bookTitle' and place information in '#show-panel' Div:
  // fetch(``)
  fetch(`http://localhost:3000/books/${bookId}`, {
    header: {
      "Content-Type": "application/json"
    },
    method:"GET",
  })
    .then((response) => response.json())
      .then((obj) => {
        console.log("obj: ", obj);
        // When a user clicks the title of a book, display the book's thumbnail, description, and a list of users who have liked the book.
        // This information should be displayed in the div#show-panel element.

        // Clear the contents of 'showPanelDiv' on each click event:
        showPanelDiv.innerHTML = '';

        let bookThumbnailImage = document.createElement("img");
        let bookTitleHeader = document.createElement("h4");
        let bookAuthorHeader = document.createElement("h4");
        let bookDescriptionParagraph = document.createElement("p");
        let usersListUl = document.createElement("ul");
        let likeButton = document.createElement("button");
        let brTag = document.createElement("br");

        let bookId = obj.id;
        let bookThumbnail = obj.img_url;
        let bookTitle = obj.title;
        let bookAuthor = obj.author;
        let bookDescription = obj.description;
        let usersList = obj.users;

        usersListUl.id = "usersListUl";

        console.log("bookThumbnail: ", bookThumbnail);
        console.log("bookTitle: ", bookTitle);
        console.log("bookAuthor: ", bookAuthor);
        console.log("bookDescription: ", bookDescription);
        console.log("usersList: ", usersList);

        bookThumbnailImage.src = bookThumbnail;
        bookTitleHeader.textContent = bookTitle;
        // NOTE: We are adding the 'id' property so that we can use it for later use:
        bookTitleHeader.id = bookId;
        bookAuthorHeader.textContent = bookAuthor;
        bookDescriptionParagraph.textContent = bookDescription;
        likeButton.textContent = "LIKE";
        likeButton.id = "likeButton";

        // TODO: Implement a for loop so that if we are dealing with an array of objects, then use '.forEach()' accordingly:
        // console.log("usersList.isArray(): ", usersList.isArray());
        if (!usersList.length) {
          console.log("usersList is NOT an array, creating an array...");

          let newArray = [];
          newArray.push(usersList);
          usersList = newArray;

          usersList.forEach((user) => {
            let userLi = document.createElement("li");
            let username = user.username;
            userLi.textContent = username;
            usersListUl.append(userLi);
          });

          console.log("usersList after creating a new array: ", usersList);
        }
        else if (usersList.length) {
          console.log("usersLists IS an array, adding new user to it...");
          console.log("usersList.length: ", usersList.length);
          usersList.forEach((user) => {
            let userLi = document.createElement("li");
            let username = user.username;
            userLi.textContent = username;
            usersListUl.append(userLi);
          });
        }
        likeButton.addEventListener("click", likeButtonClick);

        showPanelDiv.append(bookThumbnailImage, brTag, bookTitleHeader, brTag, bookAuthorHeader, brTag, bookDescriptionParagraph, brTag, usersListUl, brTag, likeButton);

      })
    .catch((error) => {
      console.log("error: ", error.message);
    });
}

// NOTE: Huge logic loophole present:
// How would you even determine the current 'user', and their associated 'id' since we never even prompted the user for this information in the first place
// Assuming that we just pick the last 'id' value accordingly since this isn't specified in the lesson itself

// After looking at 'db.json', there is a 'users' array that contains the desired users, so I am going to create my own 'user' with the following information:
// { "id": 11, "username": "sam" }
function likeButtonClick(e) {
  console.log("likeButtonClick() function called");
  console.log("e: ", e);
  console.log("e.target: ", e.target);
  console.log("e.target.parentNode: ", e.target.parentNode);

  // Update the 'likeList' on the page itself:
  let likeButton = document.querySelector("#likeButton");
  let likeList = e.target.parentNode.children[4];
  let newUserLi = document.createElement("li");
  let newUsername = "sam";

  // Rip the 'bookId' from the 'title' header:
  let bookId = e.target.parentNode.children[1].id;
  let usersArray = [];

  let usersListUl = document.querySelector("#usersListUl");

  newUserLi.textContent = newUsername;
  likeList.append(newUserLi);

  // Change the 'likeButton' element's text to 'UNLIKE' or 'UNLIKE' accordingly:
  if (likeButton.textContent === "LIKE") {
    likeButton.textContent = "UNLIKE";
  }

  else if (likeButton.textContent === "UNLIKE") {
    likeButton.textContent = "LIKE";
  }

  // Add a fetch() with the 'GET' method to grab the current 'users' array so that we can use a second fetch() call later with the 'PATCH' method:
  fetch(`http://localhost:3000/books/${bookId}`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "GET"
  })
    .then((response) => response.json())
    .then((obj) => {
      console.log("obj from likeButtonClick() function: ", obj);
      let usersArray = obj["users"];
      console.log("usersArray within fetch() method: ", usersArray);
      // Create a new 'users' based object, and add it to 'usersArray', so we can pass the new 'usersArray' object into the fetch() call via the 'PATCH' method:
      let newUserObj = {};
      newUserObj.id = 11;
      newUserObj.username = newUsername;
      // If 'sam' is already present as a user, rip that object out of the array:
      console.log("usersArray: ", usersArray);
      console.log("typeof(usersArray): ", typeof(usersArray));

      // Accounting for edge case where usersArray is only an object of 1 user which I will then create a corresponding array for:
      if (!usersArray.length) {
        console.log("usersArray is NOT an array, creating an array...");

        let newArray = [];
        newArray.push(usersArray);
        usersArray = newArray;

        usersArray.forEach((user) => {
          // Do NOT allow the 'newUsername' to be used twice:
          if (!user.name === newUsername) {
            // Append to DOM:
            let userLi = document.createElement("li");
            let username = user.username;
            userLi.textContent = username;
            usersListUl.append(userLi);
            // Push 'newUserObj' to 'usersArray':
            usersArray.push(newUserObj);
          }
        });

        console.log("usersArray after creating a new array: ", usersArray);
      }

      // Otherwise, we are dealing with an array, so loop through it, and add it to the DOM:
      else if (usersArray.length) {
        console.log("usersArray IS an array, adding new user to it...");
        console.log("usersArray.length: ", usersArray.length);
        usersArray.forEach((user) => {
          // Do NOT allow the 'newUsername' to be used twice:
          if (!user.name === newUsername) {
            // Append to DOM:
            let userLi = document.createElement("li");
            let username = user.username;
            userLi.textContent = username;
            usersListUl.append(userLi);
            // Push 'newUserObj' to 'usersArray':
            usersArray.push(newUserObj);
          }
        });
      }

      console.log("usersArray within fetch() with PATCH method: ", usersArray);

      // Add a fetch() call to update the appropriate item in the 'books' array within 'db.json':
      fetch(`http://localhost:3000/books/${bookId}`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify({
          users: usersArray
        })
      });
    })
    .catch((error) => {
      console.log("error: ", error.message);
    });
}
