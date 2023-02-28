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
