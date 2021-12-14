import moment from "moment"

type pollId = string
type timer = number

import EventEmitter from "events"
import { PollRepo } from "./Poll-repo"

const pollRepo = new PollRepo
export class PollTracker extends EventEmitter {
    private readonly ticker: NodeJS.Timer

    /**
     * 
     * @param period in seconds
     */
    constructor(private readonly period: number) {
        super()
        this.ticker = setInterval(
            () => this.checkTimer(),
            1000 * period,
        )
    }
    private _tracker: Record<pollId, timer> = {}

    /**
     * 
     * @param pollId Poll id
     * @param duration in minutes
     * @returns 
     */
    async register(pollId: string, amount: number) {
        const now = moment()
        const endsAt = now.add(amount, "seconds")
        return this._tracker[pollId] = +endsAt
    }

    async checkTimer() {
        for (const [id, time] of Object.entries(this._tracker)) {
            const now = moment()
            const endsAt = moment(time)

            if (now.isAfter(endsAt)) {
                // emit poll_ended with poll id
                this.emit("poll_ended", id)

                delete this._tracker[id]
            }
        }
    }

}
// Создаем класс, который хранит в себе ПОллы с таймером.
// Проверяем каждую минуту не прошло -ли время
// если оно прошло эмитим событие пола эндед
// а в слушателе передать айди пола
