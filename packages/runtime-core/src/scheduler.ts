// 状态
let isFlushPending = false

// 微任务
const resolvedPromise = Promise.resolve() as Promise<any>

// 当前执行任务
let currentFlushPromise: Promise<void> | null = null

// 当前执行队列
const pendingPreFlushCbs: Function[] = []

export function queuePreFlushCb(cb: Function) {
  queueCb(cb, pendingPreFlushCbs)
}

function queueCb(cb: Function, pendingQueue: Function[]) {
  pendingQueue.push(cb)
  queueFlush()
}

function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

function flushJobs() {
  isFlushPending = false
  flushPreFlushCbs()
}

export function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length) {
    // 过滤重复的
    let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    // 把原来执行队列设为空
    pendingPreFlushCbs.length = 0

    // 循环执行队列任务
    for (let i = 0; i < activePreFlushCbs.length; i++) {
      activePreFlushCbs[i]()
    }
  }
}
