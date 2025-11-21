// decryptTest.js
const { decrypt } = require("./encryption");


// 🔹 Paste the encrypted text you received from Postman below
const encryptedResponse = "18CP4VfsBXPoCLDbAMRozw==:8xPE7F9wm6erSW9a2M7RRuOEyI2pIlOFTW4zAUFHBtOcP0D63S8iEZcoA8grqKczJ38FgFxCKPrxyeSg/CC/dy3mSeBVDdLNmgZo4ORxdguGBljqaat+i6k4UVRHpsw2J73/mnt57J0s3IxNDsDRySVA3YDN9R5yIWc/vAy29E/QyNZ/bWaz96qao/deeZAqvjFgH1pkrKa9zSOQj7Q4Mw0moCYMWOnnlE3oFHb6q3s3T+CGFAqStJHZ/wyS2eMaf7ApKJ0YcQrszppVEEQhcfu6T15GqshNbePItNyQFUDhEQe0UGSYdPAOUJreeneHkTNdZh574XcGBmOaTgYW/w==";

console.log("Decrypted data:");
console.log(decrypt(encryptedResponse));