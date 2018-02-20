var fs = require('fs');

var marked = require('marked');

var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
var index_snippets = [];
var post_filenames = fs.readdirSync('_posts');
post_filenames.reverse();
post_filenames.forEach(function(filename) {
  if (!filename.endsWith('.md'))
    return;

  var html_filename = filename.replace('.md', '.html');
  var contents = fs.readFileSync('_posts/' + filename, {encoding: 'utf8'});

  // skip YML front-matter (marked off by --- before & after)
  var first_ix = contents.indexOf('---');
  var second_ix = contents.indexOf('---', first_ix + 1);

  var meta = {};
  var yaml = contents.slice(first_ix + '---'.length, second_ix);
  yaml.split('\n').forEach(function(line) {
    var colon_ix = line.indexOf(':');
    var key = line.slice(0, colon_ix).trim();
    var val = line.slice(colon_ix + 1).trim();
    if (key && val)
      meta[key] = val;
  });
  var matches = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(filename);
  if (!matches)
    throw new Error('Filename does not begin with YYYY-MM-DD: ' + filename);

  meta.date = months[parseInt(matches[2])] + ' ' + parseInt(matches[3]) + ', ' + matches[1];
  meta.url = 'posts/' + html_filename;

  var markdown = contents.slice(second_ix + '---'.length);

  var markdown_parts = markdown.split('\n\n')
  var first_paragraph = markdown_parts[0];
  var is_abbr = (markdown_parts[1] && markdown_parts[1].trim()) ||
    (markdown_parts[2] && markdown_parts[2].trim());
  index_snippets.push(genPostBody(meta, marked(first_paragraph), {abbr: is_abbr}));
  var html = genPageTop(meta) +
    genPostBody(meta, marked(markdown)) +
    genPageBottom(meta);

  fs.writeFileSync('posts/' + html_filename, html);
});

var index_html = genPageTop({title: "Peter's Dev Blog"}) +
  index_snippets.join('<hr>') +
  genPageBottom({});
fs.writeFileSync('index.html', index_html);

function genPageTop(meta) {
  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1">
<title>${meta.title}</title>
<style>
html {
  font-family: Palatino;
  padding: 0;
  margin: 0;
}
body {
  padding: 0;
  margin: 0 auto;
  max-width: 40em;
}
pre {
  margin-left: 1em;
  padding: 0.5em 1em;
  border-left: 1px solid #ccc;
  background-color: #eee;
}
pre > code { color: #666 !important }
code {
  color: red;
  background-color: #eee;
  padding: 1px 5px;
}
h1 {
  margin-bottom: 2px;
}
h1 a {
  color: #666;
  text-decoration: none;
}
h1 a:hover {
  text-decoration: underline;
}
hr {
  height: 1px;
  color: #ccc;
  border-width: 0;
  background-color: #ccc;
}
#header {
  text-align: right;
  background-color: #eee;
  color: #999;
  padding: 5px 1em;
  border-bottom: 1px solid #ccc;
}
#header a {
  color: #999;
  text-decoration: none;
}
#header a:hover {
  text-decoration: underline;
}
div.date {
  font-style: italic;
  color: #999;
}
a.more {
  margin-bottom: 1em;
  background-color: #eee;
  display: inline-block;
  padding: 0.3em 0.5em;
  color: #666;
  float: right;
  text-decoration: none;
}
a.more:hover {
  text-decoration: underline;
}
blockquote {
  font-style: italic;
  background-color: #eee;
  margin-left: 1em;
  padding: 3px 1em;
  border-left: 1px solid #ccc;
  color: #666;
}
blockquote p {
  margin: 5px 0;
}
</style>
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
</head>
<body>
  <div id="header"><a href="/">Peter Rust's Dev Blog</a></div>`;
}

function genPostBody(meta, html, opts) {
  opts = opts || {};
  return `<article>
    <h1><a href=${meta.url}>${meta.title}</a></h1>
    <div class="date">${meta.date}</div>
    ${html}
    ${opts.abbr ? `<a href=${meta.url} class="more">Read More...</a><div style="clear: both"></div>` : ''}
  </article>`;
}

function genPageBottom(meta) {
  return `</body></html>`;
}