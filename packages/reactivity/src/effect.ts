import { isArray } from '@vue/shared'
import { ComputedRefImpl } from './computed'
import { createDep, Dep } from './dep'

type KeyToDepMap = Map<any, Dep>

export type EffectScheduler = (...args: any[]) => any

// 创建依赖数据结构
const targerMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

// Effect对象
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  computed?: ComputedRefImpl<T>

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}

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

  // 构建key对应的依赖收集
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  trackEffects(dep)
}

/**
 * 利用 dep 依次跟踪指定 key 的所有 effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
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

  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) return

  triggerEffects(dep)
}

/**
 * 依次触发 dep 中保存的依赖
 * @param dep Dep
 */
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]

  // 触发依赖
  for (const effect of effects) {
    triggerEffect(effect)
  }
}

/**
 * 触发指定依赖
 * @param effect ReactiveEffect
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}
