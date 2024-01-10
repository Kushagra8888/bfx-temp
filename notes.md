The implementation of handling the updates from other clients is currently missing. I planned to solve this by using a polling mechanism to get the list of unmatched orders that can be stored on ther server. The server can store both matched orderbook as well as unmatched version. The matched version can be used to initialize a new client, while the unmatched version can be used to periodically sync the updates from the other clients.

To sync a clinet, I could go through the unmatched order book fetched from the server  populating the ones that are missing in the client version. I could identify the missing orders by using the combination of timestamp,symbol,qty and price as string (or alternatively assigning a uuid to each order). I think this setup makes the system fragile because it is dependent on the servers to store some of the data, but I did not find a way in the framework to broadcast updates to clients (I tried to have a single module act as both a client and server but it threw connection errors)

Another issue is with order matching which currently does not consider the timestamps. I could fix this by sorting by timestamp before matching. Also, I think it would be better to sync the order book before the client submits a new order and makes chnges to its local version.