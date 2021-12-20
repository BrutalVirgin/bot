export interface Poll {
    pollId: string,
    userId: number,
    votes: number,
    startDate: number,
    finalDate: number,
    chatId: number,
    username: string,
    chatMessageId: number
}