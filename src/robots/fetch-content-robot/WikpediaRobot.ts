import FetchContentRobotInterface, { ChoicesOptions } from './FetchContentRobotInterface';
import wiki from 'wikipedia';
import fs from 'fs';
import sbd from 'sbd';
import { Logger } from '../../utils/logger';
import { DataType, Storage } from '../../data/storage';
export default class WikpediaRobot implements FetchContentRobotInterface {

  async fetchMainTerms(): Promise<ChoicesOptions> {
    try {
      Logger.green("[Content Robot] Buscando termos no wikpedia");
      await wiki.setLang("pt");
      const searchResults = await wiki.search(Storage.getData().term);
      const searchableResults = searchResults.results.map(item => {
        return { title: item.title, value: item.title }
      })
      return searchableResults;
    } catch (error) {
      Logger.red("[Content Robot] Erro ao buscar termos no wikpedia "+error);
    }

    return [{ title: '', value: '' }]
  }

  async fetchContent(limit = 3): Promise<DataType> {
    const data = Storage.getData()
    try {
      Logger.green(`[Content Robot] Buscando ${limit} frases de ${data.selectedTerm || data.selectedTerm}`);
      await wiki.setLang("pt");
      const searchResults = await wiki.page(data.selectedTerm || data.selectedTerm);
      const content = this.sanitizeContent(await searchResults.content());
      this.saveTxt(content);

      const sentences = [];
      for (let i = 0; i < content.length; i++) {
        sentences.push({
          sentence: content[i],
          voice: '',
          keyword: [],
          images: []
        })
        if (sentences.length === limit) {
          Storage.setSentences(sentences)
          return Storage.getData();
        }

      }

      return Storage.getData();
    } catch (error) {
      Logger.red("[Content Robot] Erro ao buscar frases no wikpedia "+error);
    }

    return Storage.getData();
  }




  private sanitizeContent(content: string) {
    Logger.blue(`[Content Robot] Sanitizando o conteudo...`);
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

