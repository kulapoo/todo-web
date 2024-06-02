export function createElementFromStr(htmlStr: string, tagName: string = "div") {
  const frag = document.createDocumentFragment()
  let temp: null | HTMLElement = document.createElement(tagName)
  temp.innerHTML = htmlStr
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild)
  }
  temp = null
  return frag
}