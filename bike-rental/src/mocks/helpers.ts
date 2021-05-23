// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getRandom(list: unknown[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return list[Math.floor(Math.random() * list.length)];
}
