export interface IFactory<M extends Record<keyof M, new (...args: any) => any>> {
  instantiate<K extends keyof M>(type: K, ...params: ConstructorParameters<M[K]>): InstanceType<M[K]>
  instantiate(type: keyof M, ...params: unknown[]): InstanceType<M[keyof M]>
  instantiate<K extends keyof M>(type: K, ...params: ConstructorParameters<M[K]>): InstanceType<M[K]>;
}