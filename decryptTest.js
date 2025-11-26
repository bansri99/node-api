// decryptTest.js
const { decrypt } = require("./encryption");


// 🔹 Paste the encrypted text you received from Postman below
const encryptedResponse = "QgnduS64eVUY/q2YU4ipxw==:YTV3LZEVpeP+zZW8UgO4PTrDXCGOqr0/JdkBCbAuQcCN4Doef+MvA38IOFN9wADh65uHr6QzyWlZnqjyrv9T4YmYQxRWsg1Dp7gswhPwk5NMpDEu336m6CRKnbfhI6MAN3q64qtKW+OeSS6A9ezbPiFo0h8qRyeXO2MRJkAa72rrae/tOc8FGUZi637pqGH1CbifPc8gTRY6CHf32Jvxn7eDbJ7tzp0ApmL/e9KIvPG/gOIV5p5rfo6sKfAxRpKpCzWLWuj6jsC4BUWBmyS36vir0ZcYF2GxrXtN720nbVbiSCRW51EMj4kjR9goQ9S8vEQIMHibKTWfWH5gWJFOuA==";

console.log("Decrypted data:");
console.log(decrypt(encryptedResponse));