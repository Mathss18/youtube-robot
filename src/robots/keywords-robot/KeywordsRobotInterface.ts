import { DataType } from "../../data/storage";


export default interface KeywordsRobotInterface {
  setKeywords(text: DataType): Promise<DataType>
}
