const products = [
    { id: 1, name: 'Laptop', price: 800 },
    { id: 2, name: 'Smartphone', price: 500 },
    { id: 3, name: 'Headphones', price: 80 },
];

// Using map to create a new array with doubled prices
const doubledPrices = products.map((product) => {
// Creating a new object with the same properties, but the price doubled
return { product, price: product.price * 2 };
});

console.log(doubledPrices)

console.log(products)

