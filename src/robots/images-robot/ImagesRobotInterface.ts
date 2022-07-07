import { ContentOutput } from "../fetch-content-robot/WikpediaRobot";

export default interface ImagesRobotInterface {
  setImages(electedTerm:string, sentences: ContentOutput[]): Promise<ContentOutput[]>
}
