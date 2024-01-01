// DOMContentLoaded is an event that is fired when the HTML has been completely loaded and parsed
// This is a good place to add event listeners
// We're using it here to add an event listener to the form submit event
// The callback function will be run when the form is submitted
// what is Listeners? https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// addEventListener() method attaches an event handler to the specified element.
// So what listener doing is, it will listen to the event that we specified and run the function that we specified when the event is triggered.
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bookForm').addEventListener('submit', addBook);
});

// Fetch all books from the database and update the UI with the books
// This function is async because we're using await inside of it
// async functions always return a promise (even if you don't explicitly return a promise)
// async is a keyword that can be used to define a function as an asynchronous function
async function fetchBooks() {
    // try is a block of code that will attempt to run
    // if an error occurs, the catch block will run
    // This is a good way to handle errors when using async/await
    try {
        // fetch returns a promise, so we need to await it
        // await will wait for the promise to resolve before continuing the code execution
        // await can only be used inside an async function
        const response = await fetch('http://localhost:3000/data');
        // Check if the response was successful (status code 200-299)
        // If not, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // If the response was successful, parse the JSON data and log it to the console
        const data = await response.json();
        // console.log(data);
        // Update the UI with the books from the database
        const books = data.books;
        // Loop through the books and create a table row for each book
        books.forEach(createTableRow);
    } catch (error) {
        console.error('Error:', error);
    }
  }

// Add a book to the database and update the UI with the new book
async function addBook(event) {
    // Prevent the default form submit behavior which would refresh the page
    // We don't want to refresh the page because that would cause us to lose the books we've already fetched
    event.preventDefault();

    // Get the values from the form inputs
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const price = document.getElementById('price').value;

    // Create a book object from the form values
    const book = { title, author, genre, price };

    try {
        // Send a POST request to the server with the book data
        // fetch returns a promise, so we need to await it
        // await will wait for the promise to resolve before continuing the code execution
        const response = await fetch('http://localhost:3000/data', {
            // The HTTP method to use when making the request (POST, GET, PUT, DELETE, etc.)
            // This is a required property and the default is GET if not specified (which is what we want most of the time)
            method: 'POST',
            // The HTTP headers to include with the request (Content-Type, Authorization, etc.)
            // This is an optional property and the default is an empty object ({}) if not specified
            // The Content-Type header tells the server what type of data we're sending
            // In this case, we're sending JSON data, so we need to set the Content-Type header to application/json
            headers: {
                'Content-Type': 'application/json'
            },
            // stringify the book object and set it as the request body (we can't send a JavaScript object in the request)
            // The request body is the data that we're sending to the server
            body: JSON.stringify(book)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If the response was successful, parse the JSON data and log it to the console
        // fetchBook() will update the UI with the new book data from the server
        fetchBooks();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Update a book in the database and update the UI with the updated book
function updateBook(book) {

    // Set the form values to the book data
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('genre').value = book.genre;
    document.getElementById('price').value = book.price;

    // Change the form submit event listener to call submitUpdatedBook instead of addBook
    const form = document.getElementById('bookForm');
    // Remove the existing event listener (addBook) from the form submit event and add a new event listener (submitUpdatedBook)
    // This is a good way to update event listeners
    // removeEventListener will remove the event listener from the element
    form.removeEventListener('submit', addBook);
    // addEventListener will add the event listener to the element
    form.addEventListener('submit', event => {
        // Prevent the default form submit behavior which would refresh the page
        event.preventDefault();
        // Call submitUpdatedBook with the book id as an argument to update the book
        // We need to pass the book id because we don't have access to the book id inside of submitUpdatedBook
        submitUpdatedBook(book.id);
    })
}

// Submit the updated book to the server and update the UI with the updated book
async function submitUpdatedBook(id) {
    // Get the values from the form inputs
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const price = document.getElementById('price').value;

    // Create a book object from the form values
    const book = { id, title, author, genre, price };

    try {
        // Send a PUT request to the server with the updated book data
        // fetch returns a promise, so we need to await it
        const response = await fetch(`http://localhost:3000/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If the response was successful, parse the JSON data and log it to the console
        // await will wait for the promise to resolve before continuing the code execution
        const updatedBook = await response.json();
        // Update the UI with the updated book 
        // This will depend on how your UI is set up
        updateUI(updatedBook);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Delete a book from the database and remove it from the UI
async function deleteBook(id, row) {
    try {
        // Send a DELETE request to the server with the book id
        const response = await fetch(`http://localhost:3000/data/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If the response was successful, log the response body to the console
        //  https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
        row.remove();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Update the UI with the updated book
function updateUI(book) {
    // Find the table row with the book id and update the table cells with the updated book data
    // [data-id="${book.id}"] is an attribute selector that will select the element with the data-id attribute equal to the book id
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
    const row = document.querySelector(`.book-row[data-id="${book.id}"]`);
    row.children[0].textContent = book.id;
    row.children[1].textContent = book.title;
    row.children[2].textContent = book.author;
    row.children[3].textContent = book.genre;
    row.children[4].textContent = book.price;
}

function createTableRow(book) {
    const tableBody = document.getElementById('booksTableBody');
    const row = document.createElement('tr');
    row.className = 'book-row'; // Add a class to the row
    // Add the book id as a data attribute to the row 
    // so we can easily find it later if we need to update or delete
    row.dataset.id = book.id;
    // Add the book data to the row as table cells (td)
    // innerHTML is a string, so we can use a template literal to create the HTML
    // Note: this is not the best way to do this, but it's simple
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.price}</td>
      <td>
        <button class="update-button">Update</button>
        <button class="delete-button">Delete</button>
    </td>
    `;
    tableBody.appendChild(row);

    // Add event listeners to the update and delete buttons
    // addEventListener will add the event listener to the element
    row.querySelector('.update-button').addEventListener('click', () => updateBook(book));
    row.querySelector('.delete-button').addEventListener('click', () => deleteBook(book.id, row));
}

fetchBooks();