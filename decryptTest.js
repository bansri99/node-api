// decryptTest.js
const { decrypt } = require("./encryption");


// 🔹 Paste the encrypted text you received from Postman below
const encryptedResponse = "ic9ZHkoIwSkt86KkYnx2Eg==:aKLBUWtNB5y56imM15IOZB4Y3cVvqw8J0xG4QHR1RR3mzg9vJb4itfECfw51Gi3VYwgIkPb3VlgqPm1qooI4T+Gu0u0Z9wJW/4JKDhiW+S3dfE6QOrZJUTK7ZRHymNbrOYRSH4pqD2aGvBOcGk4kBSFz8IpfOnRtIuhuk+dMpH4t50RvnSqDmSgM5Y0WdY3sSHRzz3gMnGvKuRazwgvjzt+Y0BTuie/DAGqwvWKps2dj/O3wbMXppkrrq034FbpTLjVYXn1q8OwO4U2hTv52u1xmeAGcmzCvSLBgHSE99Jpru9mc9Mx5euzQLshgokzQgoWhI4pLlMHbL7OCVhnvZQ==";

console.log("Decrypted data:");
console.log(decrypt(encryptedResponse));