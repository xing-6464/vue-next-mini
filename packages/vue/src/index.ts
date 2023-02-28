let quantity = 2
let product = {
  price: 10,
  quantity: quantity
}

let total = 0

let effect = () => {
  total = product.price * product.quantity
}

effect()
console.info(`总价格：${total}`)

Object.defineProperty(product, 'quantity', {
  set(newValue) {
    console.info('set')
    quantity = newValue
    effect()
  },
  get() {
    console.info('get')
    return quantity
  }
})
