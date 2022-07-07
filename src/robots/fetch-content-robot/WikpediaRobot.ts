import FetchContentRobotInterface, { ChoicesOptions } from './FetchContentRobotInterface';
import wiki from 'wikipedia';
import fs from 'fs';
import sbd, { sentences } from 'sbd';
export default class WikpediaRobot implements FetchContentRobotInterface {

  async fetchMainTerms(seacrhTerm: string): Promise<ChoicesOptions> {
    try {
      await wiki.setLang("pt");
      const searchResults = await wiki.search(seacrhTerm);
      const searchableResults = searchResults.results.map(item => {
        return { title: item.title, value: item.title }
      })
      return searchableResults;
    } catch (error) {
      console.log(error);
    }

    return [{ title: '', value: '' }]
  }

  async fetchContent(seacrhTerm: string, limit = 3): Promise<ContentOutput[]> {
    try {
      await wiki.setLang("pt");
      const searchResults = await wiki.page(seacrhTerm);
      const content = this.sanitizeContent(await searchResults.content());
      this.saveTxt(content);

      const sentences = [];
      for (let i = 0; i < content.length; i++) {
        sentences.push({
          sentence: content[i],
          keyword: [],
          images: []
        })
        if (sentences.length === limit) {
          return sentences;
        }

      }

      return sentences;
    } catch (error) {
      console.log(error);
    }

    return [{
      sentence: '',
      keyword: [],
      images: []
    }];
  }




  private sanitizeContent(content: string) {
    const allLines = content.split('\n');
    const allLinesSanitized = allLines.filter(line => {
      if (line.trim().length === 0 || line.trim().startsWith('=')) {
        return false;
      }

      return true
    })

    const contentSanitezed = sbd.sentences(allLinesSanitized.join(' '));
    return contentSanitezed;
  }

  private saveTxt(content: string[]) {
    const file = fs.createWriteStream('array.txt');
    file.on('error', function (err) { /* error handling */ });
    content.forEach(function (v: string) { file.write(v + '\n'); });
    file.end();
  }

}

export type ContentOutput = {
  sentence: string,
  keyword: string[],
  images: string[]
}