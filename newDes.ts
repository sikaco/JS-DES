/**
 * Created with JetBrains WebStorm.
 * User: s1kac0
 * Date: 13-11-8
 * Time: 下午10:16
 * To change this template use File | Settings | File Templates.
 */
class DES {
  // initial permutation IP
  static IP_Table = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7
  ]

  // final permutation IP^-1
  static IPR_Table = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25
  ]

  // permuted choice table (key)
  static PC1_Table = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
  ]

  // permuted choice key (table)
  static PC2_Table = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
  ]

  // number left rotations of pc1
  static LOOP_Table = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]

  // expansion operation matrix
  static E_Table = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1
  ]

  // 32-bit permutation function P used on the output of the S-boxes
  static P_Table = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25]

  // The (in)famous S-boxes
  static S_Box = [
    // S1
    [
      [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
      [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
      [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
      [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    // S2
    [
      [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
      [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
      [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
      [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    // S3
    [
      [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
      [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
      [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
      [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    // S4
    [
      [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
      [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
      [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
      [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    // S5
    [
      [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
      [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
      [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
      [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    // S6
    [
      [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
      [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
      [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
      [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    // S7
    [
      [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
      [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
      [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
      [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    // S8
    [
      [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
      [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
      [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
      [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
  ]

  text = ""  //plaintext or secret text
  executedText = ""
  TB_64b = ""//64 bit plaintext block
  TB_L = ""
  TB_R = ""

  key_b = ""
  key_56b = ""
  C = ""
  D = ""
  subkey = ""
  subkeys = []

  constructor() {
    Object.assign(this, {

    })
  }

  str2bin(charStr) {
    var retBit = ""
    for (var i = 0; i < charStr.length; i++) {
      var temp = charStr.charCodeAt(i).toString(2)
      retBit += "00000000".substr(temp.length) + temp
    }
    return retBit
  }

  bin2hex(bitStr) {
    var hexStr = ""
    for (var i = 0; i < bitStr.length; i += 8) {
      var temp = parseInt(bitStr.substr(i, 8), 2).toString(16)
      hexStr += "00".substr(temp.length) + temp
    }
    return hexStr
  }

  hex2bin(hexStr) {
    var bitStr = ""
    for (var i = 0; i < hexStr.length; i += 2) {
      var temp = parseInt(hexStr.substr(i, 2), 16).toString(2)
      bitStr += "00000000".substr(temp.length) + temp
    }
    return bitStr
  }

  bin2asc(bitStr) {
    var ascStr = ""
    for (var i = 0; i < bitStr.length; i += 8) {
      ascStr += String.fromCharCode(parseInt(bitStr.substr(i, 8), 2))
    }
    return ascStr
  }

  permute(inBlock, table, outblock_length) {
    var outBlock = ""
    for (var i = 0; i < outblock_length; i++) {
      outBlock += inBlock[table[i] - 1]
    }
    return outBlock
  }

  IP() {
    this.TB_64b = this.permute(this.TB_64b, DES.IP_Table, 64)
    this.TB_L = this.TB_64b.substr(0, 32)
    this.TB_R = this.TB_64b.substr(32, 32)
  }

  Xor(bitStr1, bitStr2) {
    var outStr = ""
    for (var i = 0; i < bitStr1.length; i++) {
      outStr += (bitStr1.charCodeAt(i) ^ bitStr2.charCodeAt(i)).toString()
    }
    return outStr
  }


  subkeyCreate(j) {
    if (this.subkey == "") {
      if (this.key_b.length == 56) {
        this.key_b = this.key_b.replace(/(\d{7})/g, "$10")
      }
      this.key_56b = this.permute(this.key_b, DES.PC1_Table, 56)
      this.C = this.key_56b.substr(0, 28)
      this.D = this.key_56b.substr(28, 28)
    }
    this.C = this.C.substr(DES.LOOP_Table[j]) + this.C.substr(0, DES.LOOP_Table[j])
    this.D = this.D.substr(DES.LOOP_Table[j]) + this.D.substr(0, DES.LOOP_Table[j])
    this.key_56b = this.C + this.D
    this.subkey = this.permute(this.key_56b, DES.PC2_Table, 48)
    return this.subkey
  }

  F_func(TBR_32b, subkey_48b) {
    var TB_48b = this.permute(TBR_32b, DES.E_Table, 48)
    var bit_48b = this.Xor(TB_48b, subkey_48b)
    var result_32b = ""
    var temp_4b = ""
    for (var i = 0; i < 8; i++) {
      var lineNum = parseInt(bit_48b.charAt(6 * i) + bit_48b.charAt(6 * i + 5), 2)
      var columnNum = parseInt(bit_48b.substr(6 * i + 1, 4), 2)
      temp_4b = DES.S_Box[i][lineNum][columnNum].toString(2)
      result_32b += "0000".substr(temp_4b.length) + temp_4b
    }
    return this.permute(result_32b, DES.P_Table, 32)
  }

  RIP() {
    this.TB_64b = this.TB_L + this.TB_R
    this.TB_64b = this.permute(this.TB_64b, DES.IPR_Table, 64)
  }

  execute(inputText, key, mode) {
    this.executedText = ""
    this.TB_64b = ""
    this.TB_L = ""
    this.TB_R = ""
    this.key_b = ""
    this.key_56b = ""
    this.C = ""
    this.D = ""
    this.subkey = ""
    this.subkeys = []

    this.text = inputText
    this.key_b = this.str2bin(key)
    if (mode == "encrypt") {
      for (var j = 0; j < 16; j++) {
        this.subkeys[j] = this.subkeyCreate(j)
      }
      for (var i = 0, NotBeEncryptByte = this.text.length; NotBeEncryptByte >= 8; i += 8, NotBeEncryptByte -= 8) {
        this.TB_64b = this.str2bin(this.text.substr(i, 8))
        this.IP()
        for (j = 0; j < 15; j++) {
          var originalR = this.TB_R
          this.TB_R = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[j]))
          this.TB_L = originalR
        }
        this.TB_L = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[15]))
        this.RIP()
        this.executedText += this.bin2hex(this.TB_64b)
      }
      if (NotBeEncryptByte != 0) {
        this.TB_64b = this.str2bin(this.text.substr(this.text.length - NotBeEncryptByte)) +
          "0000000000000000000000000000000000000000000000000000000000000000".substr(8 * NotBeEncryptByte)
        this.IP()
        for (j = 0; j < 15; j++) {
          originalR = this.TB_R
          this.TB_R = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[j]))
          this.TB_L = originalR
        }
        this.TB_L = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[15]))
        this.RIP()
        this.executedText += this.bin2hex(this.TB_64b)
      }
    } else if (mode == "decrypt") {
      for (j = 0; j < 16; j++) {
        this.subkeys[15 - j] = this.subkeyCreate(j)
      }
      for (i = 0, NotBeEncryptByte = this.text.length; NotBeEncryptByte >= 16; i += 16, NotBeEncryptByte -= 16) {
        this.TB_64b = this.hex2bin(this.text.substr(i, 16))
        this.IP()
        for (j = 0; j < 15; j++) {
          originalR = this.TB_R
          this.TB_R = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[j]))
          this.TB_L = originalR
        }
        this.TB_L = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[15]))
        this.RIP()
        this.executedText += this.bin2asc(this.TB_64b)
      }
      if (NotBeEncryptByte != 0) {
        this.TB_64b = this.hex2bin(this.text.substr(this.text.length - NotBeEncryptByte)) +
          "0000000000000000000000000000000000000000000000000000000000000000".substr(8 * NotBeEncryptByte)
        this.IP()
        for (j = 0; j < 15; j++) {
          originalR = this.TB_R
          this.TB_R = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[j]))
          this.TB_L = originalR
        }
        this.TB_L = this.Xor(this.TB_L, this.F_func(this.TB_R, this.subkeys[15]))
        this.RIP()
        this.executedText += this.bin2asc(this.TB_64b)
      }
    }

    return this.executedText
  }
}

function keyLengthCheck(key) {
  return key.length >= 7 && key.length <= 8
}

function executeDES(inputTextId, keyId, mode, outputElementId) {
  var inputText = document.getElementById(inputTextId).value
  var key = document.getElementById(keyId).value
  if (keyLengthCheck(key)) {
    var time1 = new Date().valueOf()
    document.getElementById(outputElementId).value = DES.execute(inputText, key, mode)
    var time2 = new Date().valueOf()
    var executedTime = time2 - time1
    document.getElementById("executedTime").innerText = "处理时间为" + executedTime.toString() + "毫秒，打败了全国99%的用户呢！"
  } else {
    alert("密钥长度只能为7-8个字符哦")
  }
}

function execute3DES(inputTextId, keyId, mode, outputElementId) {
  var inputText = document.getElementById(inputTextId).value
  var key = document.getElementById(keyId).value
  if (keyLengthCheck(key)) {
    var time1 = new Date().valueOf()
    document.getElementById(outputElementId).value = DES.execute(DES.execute(DES.execute(inputText, key, mode), key, mode), key, mode)
    var time2 = new Date().valueOf()
    var executedTime = time2 - time1
    document.getElementById("executedTime").innerText = "处理时间为" + executedTime.toString() + "毫秒，打败了全国99%的用户呢！"
  } else {
    alert("密钥长度只能为7-8个字符哦")
  }
}


executeDES("12345678", "12345678", "encrypt")
//executeDES("c91d449b8ab46afa", "12345678", "decrypt")
//executeDES("96d0028878d58c89", "12345678", "decrypt")

