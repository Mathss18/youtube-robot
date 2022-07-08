import fs from "fs";

export type DataType = {
  term: string,
  selectedTerm: string,
  sentences: Sentence[]
};

type Sentence = {
  sentence: string;
  voice: string;
  keyword: string[];
  images: string[];
}

export class Storage {
  static getData(): DataType {
    const data: any = fs.readFileSync(__dirname+"/data.json");
    return JSON.parse(data);
  }

  static setData(data: DataType): void {
    fs.writeFileSync(__dirname+"/data.json", JSON.stringify(data));
  }

  static setTerm(term: string): void {
    const data = this.getData();
    data.term = term;
    this.setData(data);
  }

  static setSelectedTerm(selectedTerm: string): void {
    const data = this.getData();
    data.selectedTerm = selectedTerm;
    this.setData(data);
  }

  static setSentences(sentences: Sentence[]): void {
    const data = this.getData();
    data.sentences = sentences;
    this.setData(data);
  }

  static clear(){
    fs.writeFileSync(__dirname+"/data.json", '');
  }
}
