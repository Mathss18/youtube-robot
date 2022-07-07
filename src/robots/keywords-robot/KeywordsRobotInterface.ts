import { ContentOutput } from "../fetch-content-robot/WikpediaRobot";

export default interface KeywordsRobotInterface {
  setKeywords(text: ContentOutput[]): Promise<ContentOutput[]>
}
