
import KeywordsRobotInterface from "./KeywordsRobotInterface";
import * as credentials from '../../credentials/watson-nlu-credentials.json';
import NaturalLanguageUnderstanding from "ibm-watson/natural-language-understanding/v1";
import { IamAuthenticator } from "ibm-watson/auth";
import { Logger } from '../../utils/logger';
import { DataType, Storage } from "../../data/storage";

export default class WatsonNLURobot implements KeywordsRobotInterface {
  private nlu: NaturalLanguageUnderstanding;

  constructor() {
    this.nlu = new NaturalLanguageUnderstanding({
      authenticator: new IamAuthenticator({
        apikey: credentials.apikey,
      }),
      version: "2018-11-16",
      serviceUrl: credentials.url,
    });
  }
  async setKeywords(): Promise<DataType> {
    const data = Storage.getData()
    for (const sentence of data.sentences) {
      Logger.green(`[Keywords Robot] Watson está buscando keywords na frase`);
      const response: string[] = await this.fetchKeyWords(sentence.sentence)
      sentence.keyword = response;
    }

    Storage.setSentences(data?.sentences || []);
    return Storage.getData();
  }

  private async fetchKeyWords(sentence: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }).then((response: any) => {
        resolve(response.result.keywords?.map((item: any) => item.text))
      })
        .catch(error => {
          reject([])
        })
    })
  }

}