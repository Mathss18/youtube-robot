import prompts, { PromptObject } from 'prompts';
import { ChoicesOptions } from '../fetch-content-robot/FetchContentRobotInterface';
import SubjectRobotInterface from './SubjectRobotInterface';

export default class ConsoleSubjectRobot implements SubjectRobotInterface {

  private questions: PromptObject[] = [
    {
      type: 'text',
      name: 'term',
      message: 'Qual o termo de busca?'
    },
  ];

  async askSearchTerm(): Promise<string> {
    const response = await prompts(this.questions);
    return response.term
  }

  async askSearchTermValidOptions(options: ChoicesOptions): Promise<string> {
    if (options.length === 0) return '';
    const questions: PromptObject = {
      type: 'multiselect',
      name: 'term',
      message: 'Pick an option',
      choices: options
    }
    const response = await prompts(questions);
    return response.term[0]
  }

}