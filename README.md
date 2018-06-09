# web-push

## Introduce

This is a project that provides web push service. The server and the client source code will be both included.
It is now developing and testing. It is not stable.
It is for study now. Do not use in business projects.
MIT lisence.

## Running environment

### server

node js. Develope at v6.10.0 or higher. You may test the lower versions.

### client

Browers that supports XMLHttpRequest or Microsoft.XMLHTTP.

## How

- The server expose two URLs. One for the long request (let's say it URLA), and one for publishing a notification (let's say it URLB). It looks like 'sub/pub' model.
- The client requests URLA with a topic. The server keeps the request and do not response.
- The application or the third server or something else (no matter what) requests the URLB, with a topic and a message. The server will look for the requests from client that subscribe the topic, and response with the message.
- If no message is published in 25 seconds, the server will response without message. The client should handle the empty message/response.
- The client should always re-request, in order to keep the communication.

> **note:** The message should only be a mark. The message should NOT be the data. When the client reads the mark, the client should request another URL (according to the business logic) to get the data. Because the server does not check the auth of the client, so any one can subscribe the topic and message. It is not safe here if the data is transferred.
