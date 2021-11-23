type UserId = number

export interface IUserRepository {
    getSocialCreditById(userId: UserId): Promise<number>
    updateSocialCredit(userId: UserId, amount: number): Promise<number>
    findUserById(userId: number): Promise<number>
}

export class InMemoryRepository implements IUserRepository {
    async findUserById(userId: number) {
        this._usersCredit[123] = 42
        return this._usersCredit[userId]
    }
    updateSocialCredit(userId: number, amount: number): Promise<number> {
        throw new Error("Method not implemented.")
    }

    private _usersCredit: Record<UserId, number> = {
        [9827234235]: 0,
        [123]: 1231
    }

    async getSocialCreditById(userId: number) {
        return this._usersCredit[userId]
    }

}




