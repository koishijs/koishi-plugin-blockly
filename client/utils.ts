export function stringToArrayBuffer (str) {
  let array = new Uint8Array(str.length);
  for(let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer
}
