/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const url = require('url');

var store = {
  results: []
}
// console.log(messages)
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var statusCode;
  
  var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var headers = defaultCorsHeaders;

var path = url.parse(request.url).pathname;

  //if url matches
  if(path === '/classes/messages') {
    // handle GET
    if(request.method === 'GET'){
      //set status 200
      statusCode = 200;
      response.writeHead(statusCode, headers);
      // console.log("our store before we send it to you" + JSON.stringify(store))
      response.end(JSON.stringify(store));
      // handle POST
    } else if( request.method === 'POST'){
      //set status 201
      statusCode = 201;
      // console.log(request,'kdjkfd');
      //save the message to store
      var body = [];
      var bodyObj;
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        try{
          bodyObj = JSON.parse(body);
          bodyObj.objectId = store.results.length;
          store.results.push(bodyObj);
          response.writeHead(statusCode, headers);
          response.end(JSON.stringify(bodyObj));

        }catch(error){
          statusCode = 400;
          response.writeHead(statusCode,headers);
          response.end();
          console.log(error);
        }
        //console.log(bodyObj)
      });
      // handle OPTIONS
    } else if (request.method === 'OPTIONS') {
       //set status 200
      //  console.log('i am in');
      statusCode = 200;
      //write to head some special stuff
      
      response.writeHead(statusCode, headers);
      response.end()
     } 
  } else if (path !== '/classes/messages') {
    // console.log("this is bad:" + path);
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  } 
  // else {
  //   statusCode = 400;
  // }
};
module.exports.requestHandler = requestHandler;



//  The outgoing status.
/////////////////////////////////////////////////////////////////////////////////////////

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';
  // headers['Content-Type'] = 'application/json';
// 
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };


