export interface IMapOfBool {
  [key: string]: boolean
}

export function argsToMap(args: string[]): IMapOfBool {
  return args.reduce((o: IMapOfBool, key) => {
    o[key] = true
    return o
  }, {} as IMapOfBool)
}
