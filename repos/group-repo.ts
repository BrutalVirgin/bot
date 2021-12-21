import sqlite from "sqlite3"
import knex from "knex"
const config = require("knexfile.js")

type UserId = number

const db = knex(config.development)
module.exports = {
    getSocialCreditById,
    updateSocialCredit
}

function getSocialCreditById(userId: UserId) {

}

function updateSocialCredit(userId: UserId, amount: number) {

}


export interface IUserRepository {
    getSocialCreditById(userId: UserId): Promise<number>
    updateSocialCredit(userId: UserId, amount: number): Promise<number>
}

export class InMemoryRepository implements IUserRepository {
    async updateSocialCredit(userId: number, amount: number): Promise<number> {
        this._usersCredit[userId] += amount
        return Promise.resolve(this._usersCredit[userId])
    }

    private _usersCredit: Record<UserId, number> = {
        [9827234235]: 0,
        [123]: 1231,
    }

    async getSocialCreditById(userId: number) {
        const socialCredit = this._usersCredit[userId]
        if (!socialCredit) {
            return this._usersCredit[userId] = 500
        }
        return socialCredit
    }

    showUSer(userId: string) {
        const socialCredit = `${userId}:${this._usersCredit[userId]}`
        return socialCredit
    }

}

export class SqliteReposotory implements IUserRepository {
    private readonly _client: sqlite.Database

    constructor(private readonly filename: string) {
        this._client = new sqlite.Database(filename)
    }
    getSocialCreditById(userId: number): Promise<number> {
        // this._client.run()
        // db.run(
        //     `CREATE TABLE IF NOT EXISTS user_credit(user_id, social_credit)`
        // )
    }
    updateSocialCredit(userId: number, amount: number): Promise<number> {
        throw new Error("Method not implemented.")
    }

}