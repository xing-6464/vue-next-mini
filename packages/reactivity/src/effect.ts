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
  console.info('收集依赖')
}

/**
 * 触发依赖
 * @param target object
 * @param key unknown
 * @param newValue unknown
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  console.info('触发依赖')
}
