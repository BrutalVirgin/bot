type UserId = number

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

    async pollTimer() {

    }
}




