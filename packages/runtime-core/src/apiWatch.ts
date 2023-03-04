import { EMPTY_OBJ, hasChanged } from '@vue/shared'
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
    getter = () => baseGetter()
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
