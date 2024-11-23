
function showCipherSection() {
    const cipherSelect = document.getElementById("cipher-select").value;
    const sections = document.querySelectorAll(".cipher-section");
  
    sections.forEach(section => section.style.display = "none");
    if (cipherSelect) {
      document.getElementById(`${cipherSelect}-cipher`).style.display = "block";
    }
  }
  
  // Caesar Cipher
  function caesarEncrypt() {
    const plaintext = document.getElementById("caesar-plaintext").value.toUpperCase();
    const shift = parseInt(document.getElementById("caesar-shift").value, 10);
    document.getElementById("caesar-output").value = caesarCipher(plaintext, shift);
  }
  
  function caesarDecrypt() {
    const ciphertext = document.getElementById("caesar-plaintext").value.toUpperCase();
    const shift = parseInt(document.getElementById("caesar-shift").value, 10);
    document.getElementById("caesar-output").value = caesarCipher(ciphertext, -shift);
  }
  
  function caesarCipher(text, shift) {
    return text.split('').map(char => {
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift + 26) % 26) + 65);
      }
      return char;
    }).join('');
  }
  
  // RSA Cipher
  function gcd(a, b) {
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  function modInverse(e, phi) {
    let m0 = phi, t, q;
    let x0 = 0n, x1 = 1n;
  
    if (phi === 1n) return 0n;
  
    while (e > 1n) {
      q = e / phi; 
      t = phi;
  
      phi = e % phi;
      e = t;
      t = x0;
  
     
      x0 = x1 - q * x0;
      x1 = t;
    }
  
    if (x1 < 0n) x1 += m0;
  
    return x1;
  }
  
  function rsaEncrypt() {
    const plaintext = document.getElementById("rsa-plaintext").value;
    const p = BigInt(document.getElementById("rsa-p").value);
    const q = BigInt(document.getElementById("rsa-q").value);
    const e = BigInt(document.getElementById("rsa-e").value);
  
    
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
  
    
    if (gcd(e, phi) !== 1n) {
      alert("Public key (e) must be relatively prime to φ(n).");
      return;
    }
  
    console.log(`n: ${n}, φ(n): ${phi}, e: ${e}`);
  
    
    const numericPlaintext = plaintext.split('').map(char => BigInt(char.charCodeAt(0)));
  
    const encrypted = numericPlaintext.map(char => (char ** e) % n);
  
    console.log(`Encrypted values: ${encrypted}`);
  
    document.getElementById("rsa-output").value = encrypted.join(" ");
    document.getElementById("rsa-output").setAttribute("data-n", n.toString());
    document.getElementById("rsa-output").setAttribute("data-phi", phi.toString());
  }
  
  function rsaDecrypt() {
    const encrypted = document.getElementById("rsa-output").value.split(" ").map(BigInt);
    const n = BigInt(document.getElementById("rsa-output").getAttribute("data-n"));
    const phi = BigInt(document.getElementById("rsa-output").getAttribute("data-phi"));
    const e = BigInt(document.getElementById("rsa-e").value);
  
    const d = modInverse(e, phi);
  
    console.log(`Private key (d): ${d}`);
  
     const decrypted = encrypted.map(char => {
      const decodedChar = (char ** d) % n;
  
      if (decodedChar >= 32n && decodedChar <= 126n) {
        return String.fromCharCode(Number(decodedChar));
      } else {
        console.error(`Decrypted value ${decodedChar} is out of ASCII range.`);
        return '?';  }
    });
  
    console.log(`Decrypted characters: ${decrypted}`);
  
    
    document.getElementById("rsa-output").value = decrypted.join("");
  }
  
  


  function railFenceEncrypt() {
    const plaintext = document.getElementById("rail-plaintext").value;
    const rails = parseInt(document.getElementById("rail-rails").value, 10);
  
    const rail = Array.from({ length: rails }, () => []);
    let row = 0, direction = 1;
  
    for (const char of plaintext) {
      rail[row].push(char);
      row += direction;
      if (row === 0 || row === rails - 1) direction *= -1;
    }
  
    const result = rail.flat().join("");
    document.getElementById("rail-output").value = result;
  }
  
  function railFenceDecrypt() {
    const ciphertext = document.getElementById("rail-plaintext").value;
    const rails = parseInt(document.getElementById("rail-rails").value, 10);
  
    const positions = Array(ciphertext.length).fill(0);
    let row = 0, direction = 1;
  
    for (let i = 0; i < ciphertext.length; i++) {
      positions[i] = row;
      row += direction;
      if (row === 0 || row === rails - 1) direction *= -1;
    }
  
    const rail = Array.from({ length: rails }, () => []);
    let index = 0;
  
    for (let r = 0; r < rails; r++) {
      for (let i = 0; i < positions.length; i++) {
        if (positions[i] === r) {
          rail[r].push(ciphertext[index++]);
        }
      }
    }
  
    let result = "";
    row = 0;
    direction = 1;
  
    for (let i = 0; i < positions.length; i++) {
      result += rail[positions[i]].shift();
      row += direction;
      if (row === 0 || row === rails - 1) direction *= -1;
    }
  
    document.getElementById("rail-output").value = result;
  }
  
  // Playfair Cipher
  function playfairEncrypt() {
    const plaintext = document.getElementById("playfair-plaintext").value.replace(/j/gi, "i");
    const key = document.getElementById("playfair-key").value.replace(/j/gi, "i");
  
    document.getElementById("playfair-output").value = playfairCipher(plaintext, key, true);
  }
  
  function playfairDecrypt() {
    const ciphertext = document.getElementById("playfair-plaintext").value.replace(/j/gi, "i");
    const key = document.getElementById("playfair-key").value.replace(/j/gi, "i");
  
    document.getElementById("playfair-output").value = playfairCipher(ciphertext, key, false);
  }
  
function playfairCipher(text, key, encrypt = true) {
  const alphabet = "abcdefghiklmnopqrstuvwxyz"; // Exclude 'j'
  const keyGrid = [...new Set((key + alphabet).replace(/j/g, "i"))].slice(0, 25);

   function findPosition(letter) {
    const index = keyGrid.indexOf(letter);
    return [Math.floor(index / 5), index % 5];
  }

  const pairs = text.match(/.{1,2}/g).map(pair => {
    if (pair.length === 1) pair += "x"; 
    if (pair[0] === pair[1]) pair = pair[0] + "x"; 
    return pair;
  });

  const result = pairs.map(pair => {
    const [x1, y1] = findPosition(pair[0]);
    const [x2, y2] = findPosition(pair[1]);

    if (x1 === x2) {
      return keyGrid[x1 * 5 + (encrypt ? (y1 + 1) % 5 : (y1 + 4) % 5)] +
             keyGrid[x2 * 5 + (encrypt ? (y2 + 1) % 5 : (y2 + 4) % 5)];
    } else if (y1 === y2) {
      return keyGrid[((x1 + (encrypt ? 1 : 4)) % 5) * 5 + y1] +
             keyGrid[((x2 + (encrypt ? 1 : 4)) % 5) * 5 + y2];
    } else {
      return keyGrid[x1 * 5 + y2] + keyGrid[x2 * 5 + y1];
    }
  });

  return result.join("");
}
function modExp(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    while (exp > 0) {
      if (exp % 2n === 1n) {
        result = (result * base) % BigInt(mod);
      }
      exp = exp / 2n;
      base = (base * base) % BigInt(mod);
    }
    return result;
  }
  function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2n === 1n) result = (result * base) % mod;
      exp = exp / 2n;
      base = (base * base) % mod;
    }
    return result;
  }
function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      exp = exp / 2n;
      base = (base * base) % mod;
    }
    return result;
  }
  
  // ElGamal Encryption
  function elgamalEncrypt() {
    const p = BigInt(document.getElementById("elgamal-p").value);
    const g = BigInt(document.getElementById("elgamal-g").value);
    const x = BigInt(document.getElementById("elgamal-x").value);
    const plaintext = document.getElementById("elgamal-plaintext").value;
  
    if (!p || !g || !x || !plaintext) {
      alert("Please provide all inputs.");
      return;
    }
  
    const y = modExp(g, x, p); 
    const k = BigInt(Math.floor(Math.random() * Number(p - 2n)) + 1);
    const c1 = modExp(g, k, p);
    const encryptedText = [];
  
    for (const char of plaintext) {
      const m = BigInt(char.charCodeAt(0)); 
      const c2 = (modExp(y, k, p) * m) % p; 
      encryptedText.push(c2);
    }
  
    document.getElementById("elgamal-encrypted").value = `${c1} ${encryptedText.join(",")}`;
    document.getElementById("elgamal-encrypted").setAttribute("data-p", p.toString());
    document.getElementById("elgamal-encrypted").setAttribute("data-x", x.toString());
  }
  

  function elgamalDecrypt() {
    const p = BigInt(document.getElementById("elgamal-encrypted").getAttribute("data-p"));
    const x = BigInt(document.getElementById("elgamal-encrypted").getAttribute("data-x"));
    const [c1, c2List] = document.getElementById("elgamal-encrypted").value.split(" ");
    const c2Values = c2List.split(",").map(BigInt);
  
    if (!c1 || c2Values.length === 0) {
      alert("No encrypted data found.");
      return;
    }
  
    const c1BigInt = BigInt(c1);
  
    
    const decryptedText = c2Values.map(c2 => {
      const s = modExp(c1BigInt, x, p); 
      const sInv = modExp(s, p - 2n, p); 
      const m = (c2 * sInv) % p; 
      return String.fromCharCode(Number(m));
    });
  
    document.getElementById("elgamal-decrypted").value = decryptedText.join("");
  }
  
  