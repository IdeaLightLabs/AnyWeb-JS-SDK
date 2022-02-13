var forge = require('node-forge')

/**
 * AES加密 CBC模式
 * @param str
 * @param key
 */
function aesEncrypt(str, key) {
  const iv = new Array(16).fill('A').join('')
  const cipher = forge.cipher.createCipher('AES-CBC', key)
  cipher.start({ iv: iv })
  cipher.update(forge.util.createBuffer(str, 'raw'))
  cipher.finish()
  return cipher.output
}

/**
 * AES解密 CBC模式
 * @param str
 * @param key
 */
function aesDecrypt(str, key) {
  const iv = new Array(16).fill('A').join('')
  const decipher = forge.cipher.createDecipher('AES-CBC', key)
  decipher.start({ iv: iv })
  decipher.update(forge.util.createBuffer(str))
  decipher.finish()
  return decipher.output
}

const str = `123456`
token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOmZhbHNlLCJyb2xlSWRzIjpbNCwzXSwidXNlcm5hbWUiOiIxNzc4NDQ1MDIyOSIsInVzZXJJZCI6MzMsInBhc3N3b3JkVmVyc2lvbiI6MiwiaWQiOjIzLCJpYXQiOjE2NDQ1ODk4NDYsImV4cCI6MTY0NDU5NzA0Nn0.rOZ8CShouj6QUeDtetG8xPZaKeUeHRdkUnRbklE68ew'
token = token.split('.')[2]
const res = aesEncrypt(
  forge.util.hexToBytes(str),
  forge.util.createBuffer(token).getBytes().slice(0, 32)
)
console.log(res.toHex())
