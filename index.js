const fs = require('fs')

const regex = {
  braces: /{{\s*[\w\.]+\s*}}/g,
  content: /[\w\.]+/,
  specific: str => new RegExp('{{\s*' + str + '+\s*}}', 'g')
}

const write = (file, top) => {
  let html = fs.readFileSync(__dirname + file, 'utf8'),
      matches = html.match(regex.braces)

  if (matches) {
    let obj = matches.reduce((prev, tmpl) => {
      let tmplName = tmpl.match(regex.content)[0]
      if (!prev[tmplName]) {
        prev[tmplName] = write('/parts/' + tmplName)
      }
      return prev
    }, {})

    Object.keys(obj).map(key => {
      html = html.replace(regex.specific(key), obj[key])
      return true
    })
  }
  
  if (!top) {
    return '<!-- ' + file + ' -->\n' + html
  }
  fs.writeFileSync(__dirname + '/public' + file.replace('/templates', ''), html, 'utf8')
}

fs.readdir(__dirname + '/templates', (err, items) => items.map(file => write('/templates/' + file, true)))
