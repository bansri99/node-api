// decryptTest.js
const { decrypt } = require("./encryption");


// 🔹 Paste the encrypted text you received from Postman below
const encryptedResponse = "Kc8tdEh8EMvkbkROJOPyAQ==:yRA8Nvwjtb3ATFhQMIP/rnuAypgMvHetDTKK+0pQ+Hj2qauDTQ2DXzhphz4lvDz8lqwyH+On2dmFmeKZI2e/d8VpePh8jHdkDGh8ZlsJcY90m+yzQfHGoUiDJ2T6lP0hmH8P385iaieYYFwRZGPdC9eOD/WsU9u8DUM6HnabVW8EIL3PL+ndJE9cFLkZKKCRp+g1gTY+fUkqYgySTULS/gpF0LiKKdj/rhR/LooS2v8GTT4cq0wziCMGqen1/hwe+x+YVdwcH8lIVtCXhBuODP1cduy7QgPJ5eTDLh3Wu5/3xvkMsV4gPmBHtp/tphgCRxzpz7PoiJMKV+XpyE5oqg==";

console.log("Decrypted data:");
console.log(decrypt(encryptedResponse));