export default interface TextToSpeechRobotInterface {
  speech(text: string): Promise<void>
}
