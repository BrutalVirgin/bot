import { Poll } from "./interface"

export class PollRepo {
    constructor() { }

    private _pollVotes: Poll[] = []

    insertPoll(poll: Poll): Poll {
        this._pollVotes.push(poll)
        return poll
    }

    findPoll(poll: string) {
        const getPoll = this._pollVotes.find(id => id.pollId === poll)
        return getPoll
    }

    addVotes() {

    }

}