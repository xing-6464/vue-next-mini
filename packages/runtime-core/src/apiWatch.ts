import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared'
import { ReactiveEffect } from 'packages/reactivity/src/effect'
import { isReactive } from 'packages/reactivity/src/reactive'
import { queuePreFlushCb } from './scheduler'

export interface WatchOptions<immediate = boolean> {
  immediate?: immediate
  deep?: boolean
}

export function watch(souce, cb: Function, options?: WatchOptions) {
  return doWatch(souce, cb, options)
}

function doWatch(
  souce,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  let getter: () => any

  if (isReactive(souce)) {
    getter = () => souce
    deep = true
  } else {
    getter = () => {}
  }

  if (cb && deep) {
    const baseGetter = getter

    // 依赖收集
    getter = () => traverse(baseGetter())
  }

  let oldValue = {}

  // 核心
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  }

  let scheduler = () => queuePreFlushCb(job)

  const effect = new ReactiveEffect(getter, scheduler)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}

export function traverse(value: unknown) {
  if (!isObject(value)) {
    return value
  }

  for (const key in value as object) {
    traverse((value as object)[key])
  }

  return value
}
