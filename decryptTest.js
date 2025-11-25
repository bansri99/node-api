// decryptTest.js
const { decrypt } = require("./encryption");


// 🔹 Paste the encrypted text you received from Postman below
const encryptedResponse = "sWhzOAJ6zJ8lE1qI967lhQ==:lt60L9iuB0vu6sGVh8HYnXCzvyLqxvclD6TrtNGrj7JcQ2rgHMdVyxkm1sAjklT8NS5NC0LRN4WUTaapcOUY4jZx1vCnMbrs3xnvi/Qj6TUubiHhXrocHdHJgVQ4NHDs28INCY65OiZSIK1c3qg42Xnq//SMN7SpCPMQQ6s9nwlVqCmr0JyWWtBOlUXdsRdVzOnjssCtn2sv1ltjAvhOy14N/fUgQw+67HTNQiK5eD3K55B+xQ6RBAyPvuY1MEmCTlbVe+uDOGMV7e+qIjauId0c8gA3wCT8qk0N3a2hsiSjBa1EnJPeXaV8QuJAV/+7P/4xOodJWEiEpf5Nga0lHg==";

console.log("Decrypted data:");
console.log(decrypt(encryptedResponse));