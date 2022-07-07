import ImagesRobotInterface from "./ImagesRobotInterface";
import { google } from 'googleapis'
import * as credentials from '../../credentials/google-gcs-credentials.json'
import { ContentOutput } from "../fetch-content-robot/WikpediaRobot";
import imageDownloader from 'image-downloader';
import gm from 'gm';
gm.subClass({imageMagick: true});
const customsearch = google.customsearch('v1');

export default class GoogleGCSRobot implements ImagesRobotInterface {

  async setImages(selectedTerm: string, sentences: ContentOutput[]): Promise<ContentOutput[]> {
    for (const sentence of sentences) {
      const firstKeyWord = sentence.keyword[0];
      const links = await this.fetchImages(selectedTerm + ' ' + firstKeyWord);
      sentence.images = links;
    }

    return sentences;
  }

  async setImagesInDisk(sentences: ContentOutput[]): Promise<ContentOutput[]> {
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      for (let y = 0; y < sentence.images.length; y++) {
        const imageLink = sentence.images[y];
        try {
          const diskLink = await this.downloadImageByUrl(imageLink, i);
          sentence.images = []; // Limpa o array de imagens
          sentence.images.push(diskLink); // Coloca a url da imagem em disco
          break;
        } catch (error) {
          console.log(error);
        }
      }
    }
    return sentences;
  }

  private async fetchImages(searchText: string, imagesQuantity = 2): Promise<string[]> {
    const result = await customsearch.cse.list({
      auth: credentials.api_key,
      cx: credentials.search_engine_id,
      q: searchText,
      num: imagesQuantity,
      searchType: 'image'
    })

    const imagesLinks: any = result.data.items?.map(item => item.link)

    return imagesLinks;
  }

  private async downloadImageByUrl(url: string, sentenceIndex: number): Promise<string> {
    const diskUrl = process.cwd() + '/temp/' + sentenceIndex + '-original.png';
    const response = await imageDownloader.image({
      url: url,
      dest: diskUrl
    })
    const convertedImage = await this.convertImage(response.filename);
    return convertedImage

  }

  private async convertImage(diskUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const inputFile = `${diskUrl}`; // Se for gif, pegará o primeiro frame
      const outputFile = `${diskUrl}`;
      const width = 1920
      const height = 1080

      gm(diskUrl)
        .resize(300)
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> [video-robot] Image converted: ${outputFile}`)
          resolve(outputFile)
        })

    })
  }




}