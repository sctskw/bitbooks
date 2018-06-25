bitbooks
========

A combined order book view for multiple crypto exchanges

### Dependencies

- Node >= 8.11
- Redis >= 4
- VueJS >= 2.5

### Start the API

```
cd bitbooks-api
npm start
```

### Start the Client

```
cd bitbooks-client
npm run serve
```

### Start the Feeds

NOTE: Requires Redis Server to be online either on LocalHost:6379 or by setting it
with `process.env.REDIS_URL`

```
cd bitbooks-api
npm run feeds
```

### Run the Test Suite

```
npm test
```

### Architecure
![alt text](https://github.com/sctskw/bitbooks/blob/develop/architecture.png)

### Future Improvements

- Use persistent Database instead of in-memory Cache
- Leverage Lamda or Serverless Architecture for Feeds
- Client Side Unit Tests

