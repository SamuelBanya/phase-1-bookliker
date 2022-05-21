// Attempted this lab, moving on:
// "LIKE" button functionality does NOT work, but most of the lab is complete

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

        usersList.forEach((user) => {
          let userLi = document.createElement("li");
          let username = user.username;
          userLi.textContent = username;
          usersListUl.append(userLi);
        });

        console.log("usersList after creating a new array: ", usersList);
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
  let likeUl = e.target.parentNode.children[4];
  let newUsername = "sam";

  // Rip the 'bookId' from the 'title' header:
  let bookId = e.target.parentNode.children[1].id;
  let usersListUl = document.querySelector("#usersListUl");
  let likeLis = likeUl.querySelectorAll("li");
  let filteredLikeLis = [];

  console.log("likeUl: ", likeUl);

  likeLis.forEach((li) => {
    console.log("li.textContent: ", li.textContent);
    filteredLikeLis.push(li.textContent);
  });

  console.log("filteredLikeLis: ", filteredLikeLis);

  console.log("typeof(filteredLikeLis): ", typeof(filteredLikeLis));

  filteredLikeLis = filteredLikeLis.filter((li) => {
    console.log("Inside .filter() function for filteredLikeLis: ");
    console.log("li: ", li);
    // TODO: This isn't filtering the list as it should:
    li != "sam";
    console.log("li !== 'sam': ", li !== 'sam');
  });

  console.log("filteredLikeLis AFTER .filter(): ", filteredLikeLis);

  filteredLikeLis.push(newUsername);

  console.log("filteredLikeLis AFTER .push(): ", filteredLikeLis);

  // Blank out the existing 'usersListUl':
  usersListUl.innerHTML = '';

  // Cycle through 'filteredLikeLis' and add them back to the DOM:
  filteredLikeLis.forEach((li) => {
    let newUserLi = document.createElement("li");
    newUserLi.textContent = li;
    usersListUl.append(newUserLi);
  });

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
      console.log("usersArray within fetch() method for specific book id within likeButtonClick() function: ", usersArray);
      // Create a new 'users' based object, and add it to 'usersArray', so we can pass the new 'usersArray' object into the fetch() call via the 'PATCH' method:
      let newUserObj = {};
      newUserObj.id = 11;
      newUserObj.username = newUsername;

      console.log("usersArray BEFORE .forEach() loop", usersArray);

      usersArray.push(newUserObj);
      console.log("usersArray: ", usersArray);

      console.log("2");

      console.log("usersArray before fetch() with PATCH method: ", usersArray);

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
