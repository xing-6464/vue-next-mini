type KeyToDepMap = Map<any, ReactiveEffect>

// 创建依赖数据结构
const targerMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

// Effect对象
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this

    return this.fn()
  }
}

/**
 * 收集依赖
 * @param target object
 * @param key unknown
 */
export function track(target: object, key: unknown) {
  if (!activeEffect) return

  let depsMap = targerMap.get(target)
  if (!depsMap) {
    targerMap.set(target, (depsMap = new Map()))
  }

  depsMap.set(key, activeEffect)
}

/**
 * 触发依赖
 * @param target object
 * @param key unknown
 * @param newValue unknown
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  const depsMap = targerMap.get(target)
  if (!depsMap) return

  const effect = depsMap.get(key) as ReactiveEffect
  if (!effect) return

  effect.fn()
}
