import TextToSpeechRobotInterface from './TextToSpeecRobotInterface';
import * as credentials from '../../credentials/watson-tts-credentials.json'
import { IamAuthenticator } from 'ibm-watson/auth';
import TextToSpeechV1 from 'ibm-watson/text-to-speech/v1'
import fs from 'fs'


export default class WatsonTTSRobot implements TextToSpeechRobotInterface {
  async speech(text: string): Promise<void> {
    const textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.apikey,
      }),
      serviceUrl: credentials.url,
    });

    const synthesizeParams = {
      text: text,
      accept: 'audio/wav',
      voice: 'pt-BR_IsabelaV3Voice',
    }

    await textToSpeech.synthesize(synthesizeParams)
      .then((response: any) => {
        return textToSpeech.repairWavHeaderStream(response.result);
      })
      .then(buffer => {
        fs.writeFileSync('synthesize.wav', buffer);
      })
      .catch(error => {
        console.log(error);
      })
  }
}