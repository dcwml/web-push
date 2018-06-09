# Server side code

## Introduce

## Files

### server.js

The server side for single server mode.

### server.master.js

The master server for cluster mode.

### server.slave.js

The slave server for cluster mode.

## Usage

```javascript
node server.js
```

```
/service/push
The URL for the client.
  topic: String. The topic to subscribe.

/service/publish
The URL to publish a notification.
  topic: String. The topic to publish.
  message: String. The message published with the topic.
```
