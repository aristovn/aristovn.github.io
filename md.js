'use strict'

const hljs = require('highlight.js')
const marked = require('marked')

exports.md = md
function md(content) {
  return marked(content, markedOptions)
    .replace(/<pre><code class="(.*)">|<pre><code>/g, '<pre><code class="hljs $1">')
    .replace(/<!--\s*:((?:[^:]|:(?!\s*-->))*):\s*-->/g, '$1')
}

class MarkedRenderer extends marked.Renderer {
  // Adds ID anchors
  heading(text, level, raw) {
    const id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-')

    return level === 2 ? (
      `<h2 class="gaps-h-0x5">` +
        `<a class="heading-anchor decorate-link" href="#${id}" id="${id}">#</a>` +
        `<span>${text}</span>` +
      `</h2>\n`
    ) : (
      `<h${level}>` +
        text +
      `</h${level}>\n`
    )
  }

  // Adds target="_blank" to external links. Mostly copied from marked's source.
  link(href, title, text) {
    if (this.options.sanitize) {
      let prot = ''
      try {
        prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase()
      }
      catch (__) {
        return ''
      }
      if (/^(javascript|vbscript):/.test(prot)) return ''
    }
    let out = '<a href="' + href + '"'
    if (title) out += ' title="' + title + '"'
    if (/^[a-z]+:\/\//.test(href)) out += ' target="_blank"'
    out += '>' + text + '</a>'
    return out
  }
}

const markedOptions = {
  renderer: new MarkedRenderer(),
  smartypants: true,
  highlight(code, lang) {
    const {value} = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code)
    return value
  },
}
