# Clien side clode

## Introduce

## Usage

```html
<script type="text/javascript" src="/pushservice/client.js"></script>
```

```js
let cnf = {
  url: 'http://localhost:1234/service/push?topic=a',
  callback: responseText => {
    document.getElementById('time').innerHTML = new Date().toString()
    document.getElementById('message').innerHTML = responseText
  }
}
pushClient.init(cnf)
pushClient.start()
```
