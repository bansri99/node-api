// decryptTest.js
const { decrypt } = require("./encryption");


// 🔹 Paste the encrypted text you received from Postman below
const encryptedResponse = "/mRloQ+yhz1A0ZOriLBLpA==:TE0VzxejHekNL4zNHFwgN3onvsbAOHPl9HbyIgKWTDnkSG36zyrWT5IEXxWbVc6d6Hvoa9vrttlKFZu+4Z8KTl3CemAc2XNViQa194BggDXbzhg1F0dh7p75oPa/9nYq+ab9kX+KHIM0Xa+FscBPI5vh8wA02xmgc5ZyQ3frv4oI4LrSoBjvY9FqihPNJS8dA3sQ0pibeHAiU0qqSp4KIBQc45mASfQXdBKLPNmqtchnCdHlNKPZFNqQ1d6x6vrCi7ROW1Vz1fIKlNSaW49Zi1kvLgzz5VU7AoDcjwLQzK6vWk7bDiOWhO67dT3Ji0q/bzhRuhnls95ttxAvnSBG1A==";

console.log("Decrypted data:");
console.log(decrypt(encryptedResponse));