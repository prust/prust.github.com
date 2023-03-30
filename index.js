var fs = require("fs");

var marked = require("marked");

var months = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "June",
  "July",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];
var index_snippets = [];
var post_filenames = fs.readdirSync("_posts");
post_filenames.reverse();
post_filenames.forEach(function (filename) {
  if (!filename.endsWith(".md")) return;

  var html_filename = filename.replace(".md", ".html");
  var contents = fs.readFileSync("_posts/" + filename, { encoding: "utf8" });

  // skip YML front-matter (marked off by --- before & after)
  var first_ix = contents.indexOf("---");
  var second_ix = contents.indexOf("---", first_ix + 1);

  var meta = {};
  var yaml = contents.slice(first_ix + "---".length, second_ix);
  yaml.split("\n").forEach(function (line) {
    var colon_ix = line.indexOf(":");
    var key = line.slice(0, colon_ix).trim();
    var val = line.slice(colon_ix + 1).trim();
    if (key && val) meta[key] = val;
  });
  var matches = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(filename);
  if (!matches)
    throw new Error("Filename does not begin with YYYY-MM-DD: " + filename);

  meta.date =
    months[parseInt(matches[2]) - 1] +
    " " +
    parseInt(matches[3]) +
    ", " +
    matches[1];
  meta.url = "posts/" + html_filename;
  meta.tags = (meta.tags || "").split(",");
  meta.tags = meta.tags.map((tag) =>
    tag.trim().toUpperCase().replace("[", "").replace("]", "")
  );

  var markdown = contents.slice(second_ix + "---".length);

  index_snippets.push(genPostBody(meta, null, { is_homepage: true }));
  var html =
    genPageTop(meta) +
    genPostBody(meta, marked(markdown), {}) +
    genPageBottom(meta);

  fs.writeFileSync("posts/" + html_filename, html);
});

var index_html =
  genPageTop({ title: "Peter's Dev Blog", is_homepage: true }) +
  index_snippets.join("") +
  genPageBottom({});
fs.writeFileSync("index.html", index_html);

function genPageTop(meta) {
  var is_home = meta.is_homepage;
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
  background-color: white;
  font-size: larger;
  line-height: 140%;
}
body {
  padding: 0;
  margin: 0;
  background-color: white;
}
pre {
  margin-left: 1em;
  padding: 0.5em 1em;
  border-left: 1px solid #ccc;
  background-color: #eee;
  line-height: 120%;
}
pre > code {
  color: #666 !important
}
code {
  color: red;
  background-color: #eee;
  padding: 1px 5px;
}
h1 {
  margin: ${is_home ? "-7px 0 2px" : "20px 0 12px 0"};
}
h1 a {
  font-size: ${is_home ? "16pt" : "50pt"};  
  color: #333;
  text-decoration: none;
}
h1 a:hover {
  text-decoration: none;
  color: #dd0000;
}
hr {
  height: 1px;
  color: #ccc;
  border-width: 0;
  background-color: #ccc;
}
#header {
  color: white;
  background-image: url('/dev-blog.jpg');
  background-color: black;
  background-size: 1024px;
  height: 314px;
  background-repeat: no-repeat;
  background-position: left center;
  padding: 0;

  display: grid;
  align-items: center;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
#header p {
  padding: 10px
}
.title {
  margin: 0;
  padding: 5px 20px;
  color: white;
  background-color: #dd0000;
  font-size: 30px;
  line-height: 110%;
  text-shadow: 1px 1px 2px #333;
}
.title a {
  color: white;
  text-decoration: none;
}
.nav-bar {
  background-color: #dd0000;
  height: 14px;
}
#header a:hover {
  text-decoration: underline;
}
.title .pull-right {
  float: right;
  margin-top: 0px;
  text-shadow: none;
  font-size: 12pt
}

div.date {
  font-style: italic;
  color: #a7a7a7;
  font-size: 11pt;
  float: left;
  margin-right: 5px;
}
a.more {
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
#articles {
  margin: 50px 5%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, ${is_home ? '1fr' : '720px'}));
  grid-gap: 1rem;
}
article {
  padding: 10px;
  margin: 0;
  background-color: white;
  border: 3px solid #ddd;
  border-width: 0 0 0 3px;
}
${
  meta.is_homepage
    ? `
    article:hover {
      border-color: #dd0000;
      color: black;
      background-color: #eee;
    }
    article:hover .date {
      color: #666;
    }
    `
    : ``
}
h2 {
  font-size: 25pt;
  margin: 50px 0 0 0
}
.article-top {
  overflow: hidden
}
article .tags {
  font-size: 8pt;
}
article .tags span {
  background-color: #b9b9b9;
  color: white;
  border-radius: 3px;
  padding: 1px 5px 0;
}
article .subhead {
  font-size: ${is_home ? "12pt" : "18pt"};
  color: #333;
  font-style: italic;
}
</style>
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
</head>
<body>
<div class="title">
  <div class="pull-right"><a href="https://twitter.com/prust_dev"><img src="/twitter-logo.png" style="width: 20px; vertical-align: -2px"> Follow <b>@prust_dev</b></a></div>
  <a href="/">Peter's Dev Blog</a>
</div>
<div id="header">
  <p></p>
  <p>Insight and tips from 20 years of software development.</p>
</div>
<div class="nav-bar"></div>
<div id="articles">
  `;
}

function genPostBody(meta, html, opts) {
  opts = opts || {};

  // ellide tags in an intelligent way
  let total_chars = 0;
  let max_chars = 18;

  let ellided_tags;
  if (opts.is_homepage) {
    ellided_tags = [];
    for (let [ix, tag] of meta.tags.entries()) {
      total_chars += tag.length + 2; // tack on more for the space between tags

      // truncate the tag if it went over the char limit
      let is_over_limit = total_chars > max_chars;
      if (is_over_limit) {
        tag = tag.slice(0, max_chars - total_chars) + "…";
      }

      // if we're already over & there are additional tags
      // replace the final one w/ '…' to indicate there are more and bail
      if (is_over_limit && ix < meta.tags.length - 1) {
        ellided_tags.push("…");
        break;
      }

      ellided_tags.push(tag);
    }
  } else {
    // don't ellide tags if this isn't the homepage
    ellided_tags = meta.tags;
  }

  return `<article>
  <div class="article-top">
    <div class="date">${meta.date}</div>
    <div class="tags">${ellided_tags
      .map((tag) => `<span>${tag}</span>`)
      .join(" ")}</div>
  </div>  
  <h1><a href=${meta.url}>${meta.title}</a></h1>
  <div class="subhead">${meta.subhead || ""}</div>
    
    ${html || ""}
  </article>`;
}

function genPageBottom(meta) {
  return `</div><div class="nav-bar"></div></body></html>`;
}
