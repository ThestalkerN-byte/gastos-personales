export interface IBotRepository {
    sendMessage(message: string): Promise<void>;
    receivePhoto(photo: string): Promise<void>;
    receiveMessage(message: string): Promise<void>;
    receiveCommand(command: string): Promise<void>;
}