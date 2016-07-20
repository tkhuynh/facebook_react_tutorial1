/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// var COMMENTS_FILE = path.join(__dirname, 'comments.json');

mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  "mongodb://localhost/react-comment-tutorial-app");

var Comment = require('./models/comment');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/comments', function(req, res) {
  Comment.find(function(err, allComments) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      res.json(allComments);
    }
  });
});

app.post('/api/comments', function(req, res) {
  var newComment = new Comment(req.body);

  newComment.save(function(err, savedComment) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      Comment.find(function(err, allComments) {
        if (err) {
          console.error(err);
          process.exit(1);
        } else {
          res.json(allComments);
        }
      });
    }
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});