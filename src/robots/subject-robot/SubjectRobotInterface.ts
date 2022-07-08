import { DataType } from "../../data/storage"
import { ChoicesOptions } from "../fetch-content-robot/FetchContentRobotInterface"

export default interface SubjectRobotInterface {
  askSearchTerm(): Promise<DataType>
  askSearchTermValidOptions(options: ChoicesOptions): Promise<DataType>
}
