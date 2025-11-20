// decryptTest.js
const { decrypt } = require("./encryption");


// 🔹 Paste the encrypted text you received from Postman below
const encryptedResponse = "jGqHBfG8vdWcLIonRXNz6g==:JIZ2lzvODNo/HOqpiLxf/16H6wznElCHCmvsPSa5AZbVeuHDFkxwk2mepJIqrf8CpZlsvAIbpfYWkVmQymiGPC6OmcLRAqirIK8tpvkV+hyRuo63ZZDmMFHlwq/kHlC3Ev8DNtyTEXbRVMiGIytL+a/aT5M20ipY5kvOKn+hcVe5Km0s0Rxy/y7nO+9QLWGaIpYkkuUnupWYo6vME/UsMiiF5Lcy7ajCWYWV4vdyS807rihp3I9iqwPhE/B4+NlUyhGPyGu7rG405/+bzg29Cy3vWwwQDN7NkFxnCEMv2isoJSRfBdASipaktvSkVjLCPjPH5VehHlTPh1bA/Cd9sQ==";

console.log("Decrypted data:");
console.log(decrypt(encryptedResponse));