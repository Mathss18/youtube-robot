import dotenv from 'dotenv'
import WikpediaRobot from './robots/fetch-content-robot/WikpediaRobot';
import GoogleGCSRobot from './robots/images-robot/GoogleGCSRobot';
import WatsonNLURobot from './robots/keywords-robot/WatsonNLURobot';
dotenv.config()

import ConsoleSubjectRobot from "./robots/subject-robot/ConsoleRobot";
import WatsonTTSRobot from './robots/text-to-speech-robot/WatsonTTSRobot';


const subjectRobot = new ConsoleSubjectRobot();
const fetchContentRobot = new WikpediaRobot();
const keywordsRobot = new WatsonNLURobot();
const imagesRobot = new GoogleGCSRobot();
const textToSpeechRobot = new WatsonTTSRobot();


async function start() {
  const data = {
    prefix: "",
    term: "",
  }

  const term = await subjectRobot.askSearchTerm();
  const mainTerms = await fetchContentRobot.fetchMainTerms(term);
  const selectedTerm = await subjectRobot.askSearchTermValidOptions(mainTerms);
  const sentences = await fetchContentRobot.fetchContent(selectedTerm, 2);
  const contentWithKeywords = await keywordsRobot.setKeywords(sentences);
  const contentWithImagesLinks = await imagesRobot.setImages(selectedTerm, contentWithKeywords);
  const contentWithImagesDisk = await imagesRobot.setImagesInDisk(contentWithImagesLinks);
  console.log(contentWithImagesDisk)
  
  // textToSpeechRobot.speech(subject.title + '\n' + subject.description);

}

start();