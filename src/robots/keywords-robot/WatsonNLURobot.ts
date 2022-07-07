import { sentences } from 'sbd';
import { ContentOutput } from "../fetch-content-robot/WikpediaRobot";
import KeywordsRobotInterface from "./KeywordsRobotInterface";
import * as credentials from '../../watson-nlu-credentials.json';
import NaturalLanguageUnderstanding from "ibm-watson/natural-language-understanding/v1";
import { IamAuthenticator } from "ibm-watson/auth";

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
  async setKeywords(sentences: ContentOutput[]): Promise<ContentOutput[]> {

    for (const sentence of sentences) {
      const response: string[] = await this.fetchKeyWords(sentence.sentence)
      sentence.keyword = response;
    }

    return sentences;
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