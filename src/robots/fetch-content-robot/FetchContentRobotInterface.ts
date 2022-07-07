export default interface FetchContentRobotInterface {
  fetchMainTerms(seacrhTerm: string): Promise<ChoicesOptions>
}

export type ChoicesOptions = { title: string, value: string }[]