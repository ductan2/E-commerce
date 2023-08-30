export const EnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter(value => typeof value === 'string') as string[] | number[]
}
