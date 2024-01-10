'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const { match_orders } = require('./utils')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

let orders = []

const peer = new PeerRPCClient(link, {})
peer.init()


peer.request('get_order_book', null, { timeout: 10000 }, (err, data) => { 
    if (err) {
        console.log("no initial order book")
        // console.error(err)
        // process.exit(-1)
      } else {
          orders = data
          console.log("order book initialized", orders)
      }

    // Sync orders
    //   setInterval(() => {
    //     index += 1
    //     peer.request('get_order_book', { data, port }, { timeout: 10000 }, (err, data) => { 
    //             if (err) {
    //             //   console.error(err)
    //                 // process.exit(-1)
    //             }
    //             }) 
    //     }, 2000)
    
    let to_submit = [
        { side: "B", qty: 10, symbol: "A", price: 10},
        { side: "B", qty: 10, symbol: "A", price: 10},
        { side: "S", qty: 10, symbol: "A", price: 10},
    ]
      
      let index = 0
      const interval = setInterval(() => {
          const data = to_submit[index]
          orders.push(data)
          orders = match_orders(orders)
          console.log("submit order", data)
          peer.request('submit_order', { ...data, timestamp: Date.now() }, { timeout: 10000 }, (err, data) => { 
              if (err) {
                  console.error(err)
                  // process.exit(-1)
                }
              }) 
            index += 1
            if (index >= to_submit.length) {
                clearInterval(interval)
            }
      }, 2000)
    })