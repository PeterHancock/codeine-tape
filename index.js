var fs = require('fs'),
    mustache = require('mustache'),
    concat = require('concat-stream'),
    through = require('through2')

module.exports = function(view) {
    var t = through()
    var v = Object.assign({}, view, {
        bundle: view.srcfile ? view.srcfile.replace(/\.js$/, '-bundle.js') : 'bundle.js'
    })

    fs.createReadStream(__dirname + '/page.template').pipe(concat(function (template) {
        t.end(mustache.render(template.toString(), v))
    }))

    return t
}
