import { DataType } from "../../data/storage";

export default interface TextToSpeechRobotInterface {
  speech(): Promise<DataType>
}
