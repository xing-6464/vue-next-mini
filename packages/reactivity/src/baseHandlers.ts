import { track, trigger } from './effect'

const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target: object, key: string | symbol, receiver: object) {
    // 获取代理对象value
    const res = Reflect.get(target, key, receiver)

    // 依赖收集
    track(target, key)

    return res
  }
}

function createSetter() {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    reactive: object
  ) {
    const res = Reflect.set(target, key, value, reactive)

    // 触发依赖
    trigger(target, key, value)

    return res
  }
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set
}
