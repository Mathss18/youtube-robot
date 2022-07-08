import dotenv from 'dotenv'
import { Storage } from './data/storage';
import WikpediaRobot from './robots/fetch-content-robot/WikpediaRobot';
import GoogleGCSRobot from './robots/images-robot/GoogleGCSRobot';
import WatsonNLURobot from './robots/keywords-robot/WatsonNLURobot';
dotenv.config()

import ConsoleSubjectRobot from "./robots/subject-robot/ConsoleRobot";
import WatsonTTSRobot from './robots/text-to-speech-robot/WatsonTTSRobot';
import { Logger } from './utils/logger';


const subjectRobot = new ConsoleSubjectRobot();
const fetchContentRobot = new WikpediaRobot();
const keywordsRobot = new WatsonNLURobot();
const imagesRobot = new GoogleGCSRobot();
const textToSpeechRobot = new WatsonTTSRobot();


async function start() {


  await subjectRobot.askSearchTerm();
  await subjectRobot.askSearchTermValidOptions(await fetchContentRobot.fetchMainTerms());
  await fetchContentRobot.fetchContent(1);
  await keywordsRobot.setKeywords();
  await imagesRobot.setImages();
  await imagesRobot.setImagesInDisk();
  await textToSpeechRobot.speech();
  Logger.magenta('Done!')


}

start();