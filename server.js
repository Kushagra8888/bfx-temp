'use strict'

const { PeerRPCServer, PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
// const { match_orders } = require('./utils')

let orders = []

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')

const clientPeer = new PeerRPCClient(link, {})
clientPeer.init()

service.listen(port)

setInterval(function () {
    link.announce('submit_order', service.port, {})
  }, 1000)
  
  setInterval(function () {
    link.announce('get_order_book', service.port, {})
  }, 1000)
  
  service.on('request', (rid, key, payload, handler) => {
      if(key === 'submit_order') {
          if (payload.port != port) {
              orders.push(payload)
            //   orders = match_orders(orders)
              console.log("updated order", orders)
          }
          handler.reply(null, null)
      } else if (key === 'get_order_book') {
          handler.reply(null, orders)
      }
  })


