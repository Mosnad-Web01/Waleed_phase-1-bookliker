document.addEventListener("DOMContentLoaded", () => {
  const listPanel = document.querySelector("#list");
  const showPanel = document.querySelector("#show-panel");
  const currentUser = { id: 1, username: "pouros" };

  // Fetch books and display their titles
  fetch("http://localhost:3000/books")
    .then((response) => response.json())
    .then((books) => {
      books.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        listPanel.appendChild(li);
      });
    });

  // Show book details when a book title is clicked
  function showBookDetails(book) {
    showPanel.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p>${book.description}</p>
            <ul>
                ${book.users
                  .map((user) => `<li>${user.username}</li>`)
                  .join("")}
            </ul>
            <button>${isBookLikedByUser(book) ? "Unlike" : "Like"}</button>
        `;

    const likeButton = showPanel.querySelector("button");
    likeButton.addEventListener("click", () => toggleLike(book));
  }

  // Check if the current user has already liked the book
  function isBookLikedByUser(book) {
    return book.users.some((user) => user.id === currentUser.id);
  }

  // Toggle the like status of a book
  function toggleLike(book) {
    let updatedUsers;

    if (isBookLikedByUser(book)) {
      // If already liked, remove the user (unlike)
      updatedUsers = book.users.filter((user) => user.id !== currentUser.id);
    } else {
      // If not liked yet, add the user (like)
      updatedUsers = [...book.users, currentUser];
    }

    // Update the book data on the server
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: updatedUsers }),
    })
      .then((response) => response.json())
      .then((updatedBook) => {
        showBookDetails(updatedBook); // Refresh the book details with the updated data
      });
  }
});
