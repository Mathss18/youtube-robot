import TextToSpeechRobotInterface from "./TextToSpeecRobotInterface";
import * as credentials from "../../credentials/watson-tts-credentials.json";
import { IamAuthenticator } from "ibm-watson/auth";
import TextToSpeechV1 from "ibm-watson/text-to-speech/v1";
import fs from "fs";
import { Logger } from "../../utils/logger";
import { DataType, Storage } from "../../data/storage";

export default class WatsonTTSRobot implements TextToSpeechRobotInterface {
  private textToSpeech: TextToSpeechV1;
  constructor() {
    this.textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.apikey,
      }),
      serviceUrl: credentials.url,
    });
  }
  async speech(): Promise<DataType> {
    const data = Storage.getData();

    for (let i = 0; i < data.sentences.length; i++) {
      const sentence = data.sentences[i];
      const response = await this.createVoice(sentence.sentence, i);
      sentence.voice = response;
    }

    return Storage.getData();
  }

  private async createVoice(text: string, sentenceIndex: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const synthesizeParams = {
        text: text,
        accept: "audio/wav",
        voice: "pt-BR_IsabelaV3Voice",
      };

      this.textToSpeech
        .synthesize(synthesizeParams)
        .then((response: any) => {
          return this.textToSpeech.repairWavHeaderStream(response.result);
        })
        .then((buffer) => {
          const diskUrl = process.cwd() + "/temp/" + sentenceIndex + "-original-audio.wav";
          fs.writeFileSync(diskUrl, buffer);
          resolve(diskUrl);
        })
        .catch((error) => {
          Logger.red("Erro ao criar audio "+error)
        });
    });
  }
}
