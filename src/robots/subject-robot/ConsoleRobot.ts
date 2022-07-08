import prompts, { PromptObject } from "prompts";
import { DataType, Storage } from "../../data/storage";
import { Logger } from "../../utils/logger";
import { ChoicesOptions } from "../fetch-content-robot/FetchContentRobotInterface";
import SubjectRobotInterface from "./SubjectRobotInterface";

export default class ConsoleSubjectRobot implements SubjectRobotInterface {
  async askSearchTerm(): Promise<DataType> {
    Storage.clear();
    const response = await prompts([
      {
        type: "text",
        name: "term",
        message: "What is the search term?",
      },
    ]);

    await Storage.setData({
      term: response.term,
      selectedTerm: "",
      sentences: [],
    });

    return Storage.getData();
  }

  async askSearchTermValidOptions(options: ChoicesOptions): Promise<DataType> {
    if (options.length === 0) return Storage.getData();
    const questions: PromptObject = {
      type: "select",
      name: "term",
      message: "Pick an option",
      choices: options,
    };
    const response = await prompts(questions);
    Storage.setSelectedTerm(response.term);
    return Storage.getData();
  }
}
