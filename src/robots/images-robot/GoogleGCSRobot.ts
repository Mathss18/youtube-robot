import ImagesRobotInterface from "./ImagesRobotInterface";
import { google } from "googleapis";
import * as credentials from "../../credentials/google-gcs-credentials.json";
import imageDownloader from "image-downloader";
import fs from "fs";
import gm from "gm";
import { Logger } from "../../utils/logger";
import { DataType, Storage } from "../../data/storage";
const imageMagick = gm.subClass({ imageMagick: true });
const customsearch = google.customsearch("v1");

export default class GoogleGCSRobot implements ImagesRobotInterface {
  async setImages(): Promise<DataType> {
    const data = Storage.getData();
    const dir = "./temp";

    if (!fs.existsSync(process.cwd() + "/" + dir)) {
      fs.mkdirSync(process.cwd() + "/" + dir);
    }
    for (const sentence of data.sentences) {
      const firstKeyWord = sentence.keyword[0];
      const links = await this.fetchImages(data.selectedTerm + " " + firstKeyWord);
      sentence.images = links;
    }

    Storage.setSentences(data.sentences)
    return Storage.getData();
  }

  async setImagesInDisk(): Promise<DataType> {
    const data = Storage.getData();
    for (let i = 0; i < data.sentences.length; i++) {
      const sentence = data.sentences[i];
      for (let y = 0; y < sentence.images.length; y++) {
        const imageLink = sentence.images[y];
        try {
          const diskLink = await this.downloadImageByUrl(imageLink, i);
          sentence.images = []; // Limpa o array de imagens
          sentence.images.push(diskLink); // Coloca a url da imagem em disco
          break;
        } catch (error) {
          Logger.red("[Image Robot] Fail to download image: " + error);
        }
      }
    }
    return Storage.getData();
  }

  private async fetchImages(
    searchText: string,
    imagesQuantity = 2
  ): Promise<string[]> {
    const result = await customsearch.cse.list({
      auth: credentials.api_key,
      cx: credentials.search_engine_id,
      q: searchText,
      num: imagesQuantity,
      searchType: "image",
    });

    const imagesLinks: any = result.data.items?.map((item) => item.link);

    return imagesLinks;
  }

  private async downloadImageByUrl(
    url: string,
    sentenceIndex: number
  ): Promise<string> {
    const diskUrl = process.cwd() + "/temp/" + sentenceIndex + "-original.png";
    await imageDownloader.image({
      url: url,
      dest: diskUrl,
    });
    Logger.green("[Image Robot] Image downloaded");
    const convertedImage = await this.convertImage(diskUrl);
    return convertedImage;
  }

  private async convertImage(diskUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const inputFile = `${diskUrl}`; // Se for gif, pegará o primeiro frame
      const outputFile = `${diskUrl}`;
      const width = 1920;
      const height = 1080;

      imageMagick(diskUrl)
        .out("(")
        .out("-clone")
        .out("0")
        .out("-background", "white")
        .out("-blur", "0x8")
        .out("-resize", `${width}x${height}^`)
        .out(")")

        .out("(")
        .out("-clone")
        .out("0")
        .out("-background", "white")
        .out("-resize", `${width}x${height}`)
        .out("-borderColor", "white")
        .out("-border", "5")
        .out(")")

        .out("-delete", "0")
        .out("-gravity", "center")
        .out("-compose", "over")
        .out("-composite")
        .out("-extent", `${width}x${height}`)
        .write(outputFile, (error) => {
          if (error) {
            return reject(error);
          }

          Logger.green(`[Image Robot] Image converted: ${outputFile}`);
          resolve(outputFile);
        });
    });
  }
}
