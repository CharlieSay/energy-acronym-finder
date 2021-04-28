import acronymList from '../data/acronymList.json'

export type AcronymHookResponse = {
  totalResults: number
  results: Acronym[]
}

export type Acronym = {
  acronym: string
  description: string
  commonlyUsed: string
}

export const getAcronyms = (): AcronymHookResponse => {
  return { totalResults: acronymList.length, results: acronymList }
}
