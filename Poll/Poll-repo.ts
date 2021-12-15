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

    updatePoll(poll: Poll) {
        var curPol = this.findPoll(poll.pollId)
        const updatedPoll = { ...curPol, ...poll }

        this.delete(curPol!.pollId)
        this.insertPoll(updatedPoll)
    }

    delete(pollId: string) {
        const position = this._pollVotes.findIndex(poll => poll.pollId === pollId)
        if (position != -1) {
            this._pollVotes.splice(position, 1)
        } else {
            console.log("Repo is empty")
        }
    }
}