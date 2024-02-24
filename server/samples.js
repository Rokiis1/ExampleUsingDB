// app.get is a method in Express for handling GET requests
// app.get takes two arguments: a path and a callback function
// the callback function takes two arguments: req and res
// req is an object that represents the HTTP request
// res is an object that represents the HTTP response
// app.get(`${API_BASE_ROUTE}/books`, (req, res) => {
//     try {
//         // res.send sends a response of the specified type to the client
//         // res.send takes one argument: the data to send
//         res.send(books);
//     } catch (error) {
//         console.error(error);
//         // res.status sets the HTTP status code of the response
//         // res.status takes one argument: the HTTP status code to set on the response
//         res.status(500).send('Error fetching books');
//     }
// });