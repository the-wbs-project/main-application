import { customAlphabet } from 'nanoid';

let chars: string = '';
let lower = 'a';
let upper = 'A';
let number = '1';

for (let i = 0; i < 26; i++) {
  if (i < 10) {
    chars += lower + upper + number;
    number = String.fromCharCode(number.charCodeAt(0) + 1);
  } else {
    chars += lower + upper;
  }
  lower = String.fromCharCode(lower.charCodeAt(0) + 1);
  upper = String.fromCharCode(upper.charCodeAt(0) + 1);
}
chars = chars.replace(':', '');
const nanoId = customAlphabet(chars, 10);

export class IdService {
  static generate(): string {
    return nanoId();
  }
}
