import { createNamespace } from 'cls-hooked'

export const clsProxifyNamespaceName = 'clsProxifyNamespace'
export const clsProxifyNamespace = createNamespace(clsProxifyNamespaceName)

export const setClsProxyValue = <T extends object>(clsKey: string, proxy: T) => clsProxifyNamespace.set(clsKey, proxy)
export const getClsProxyValue = <T extends object>(clsKey: string): T | undefined => clsProxifyNamespace.get(clsKey)

export const clsProxify = <T extends object>(clsKey: string, targetToProxify: T) => {
  const proxified = new Proxy(targetToProxify, {
    get(target, property, receiver) {
      target = getClsProxyValue(clsKey) || target
      return Reflect.get(target, property, receiver)
    },
    apply(target, thisArg, args) {
      target = getClsProxyValue(clsKey) || target
      return Reflect.apply(target as () => any, thisArg, args)
    },
    construct(target, args) {
      target = getClsProxyValue(clsKey) || target
      return Reflect.construct(target as new () => any, args)
    },
    has(target, key) {
      target = getClsProxyValue(clsKey) || target
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      target = getClsProxyValue(clsKey) || target
      return Reflect.ownKeys(target)
    },
    getOwnPropertyDescriptor(target, key) {
      target = getClsProxyValue(clsKey) || target
      return Reflect.getOwnPropertyDescriptor(target, key)
    },
  })
  return proxified
}
