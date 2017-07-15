const fs = require('fs')

const html = fs.readFileSync(__dirname + '/test.html', 'utf8')

let output

const regex = {
  braces: /{{\s*[\w\.]+\s*}}/g,
  content: /[\w\.]+/,
  contentBraces: str => new RegExp('{{\s*' + str + '+\s*}}', 'g')
}

let obj = html.match(regex.braces).reduce((prev, tmpl) => {
  let tmplName = tmpl.match(regex.content)[0]
  if (!prev[tmplName]) {
    prev[tmplName] = fs.readFileSync(__dirname + '/' + tmplName + '.html', 'utf8')
  }
  return prev
}, {})

Object.keys(obj).map(key => {
  output = html.replace(regex.contentBraces(key), obj[key])
})

console.log(output)
