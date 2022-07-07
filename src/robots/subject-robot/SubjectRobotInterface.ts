import { ChoicesOptions } from "../fetch-content-robot/FetchContentRobotInterface"

export default interface SubjectRobotInterface {
  askSearchTerm(): Promise<string>
  askSearchTermValidOptions(options: ChoicesOptions): Promise<string>
}
