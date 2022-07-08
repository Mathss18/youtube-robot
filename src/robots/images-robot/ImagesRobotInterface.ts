import { DataType } from "../../data/storage";


export default interface ImagesRobotInterface {
  setImages(electedTerm:string, sentences: DataType): Promise<DataType>
}
