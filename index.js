var fs = require('fs'),
    mustache = require('mustache'),
    concat = require('concat-stream'),
    through = require('through2')

function render(view, opts) {
    var t = through()
    opts = opts || {}
    var bundle = view.srcfile ? (opts.resolveTapeScript ? opts.resolveTapeScript(view.srcfile) : view.srcfile.replace(/\.js$/, '-bundle.js')) : null
    var v = Object.assign({}, view, {
        bundle: bundle
    })

    fs.createReadStream(__dirname + '/page.template').pipe(concat(function (template) {
        t.end(mustache.render(template.toString(), v))
    }))
    return t
}

module.exports = {
    render: render,
    static: __dirname + '/static'
}
