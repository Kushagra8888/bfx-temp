const match_orders = (orders) => {
    const symbols = new Set(orders.map(o => o.symbol))
    let result_orders = []
    for (let symbol of symbols) {
        const buy_orders = orders.filter(o => o.side === 'B' && o.symbol === symbol)
        const sell_orders = orders.filter(o => o.side === 'S' && o.symbol === symbol)
        buy_orders.sort((a, b) => a.price - b.price)
        sell_orders.sort((a, b) => b.price - a.price)

        for (let buy_order_idx = 0; buy_order_idx < buy_orders.length; buy_order_idx++) {
            for (let sell_order_idx = 0; sell_order_idx < sell_orders.length; sell_order_idx++) {
                const buy_order = buy_orders[buy_order_idx]
                const sell_order = sell_orders[sell_order_idx]
                if (buy_order.price >= sell_order.price) {
                    const qty = Math.min(buy_order.qty, sell_order.qty)
                    console.log("matched", buy_order.qty, sell_order.qty)
                    buy_order.qty -= qty
                    sell_order.qty -= qty
                }
                if (buy_order.qty == 0) {
                    break
                }
            }
        }
        result_orders.push(...buy_orders)
        result_orders.push(...sell_orders)
        result_orders = result_orders.filter(o => o.qty > 0)
    }
    return result_orders
}

module.exports = {
    match_orders
}