import { rejects } from "assert/strict";
import e from "express";
import { type } from "os";
import { resolve } from "path/posix";
import { Telegraf, Telegram } from "telegraf";
import { text } from "telegraf/typings/button";
import { InMemoryRepository } from "./repos/group-repo"
import { PollRepo } from "./Poll/Poll-repo"
import { PollTracker } from "./Poll/Poll-tracker";
import moment from "moment";

const bot = new Telegraf("2115931653:AAHDDjLXvDb7bYKkzu-qfMZid8wVYKF9R_k")
const api = new Telegram("2115931653:AAHDDjLXvDb7bYKkzu-qfMZid8wVYKF9R_k")

const groupsRepo = new InMemoryRepository()
const pollRepo = new PollRepo()
const pollTracker = new PollTracker(1)

bot.start((ctx) =>
    ctx.reply(
        `Приветствую, ${ctx.from.id ? ctx.from.id : "хороший человек"
        }! Набери /help и увидишь, что я могу.`
    )
);

// Обработчик команды /help
bot.help((ctx) => ctx.reply("Справка в процессе"));

// Обработчик команды /whoami
bot.command("whoami", (ctx) => {
    const { id, username, first_name, last_name } = ctx.from;
    return ctx.replyWithMarkdown(`Кто ты в телеграмме:
        *id* : ${id}
        *username* : ${username}
        *Имя* : ${first_name}
        *Фамилия* : ${last_name}
        *chatId* : ${ctx.chat.id}`);
});

bot.command("users", (ctx) => {
    ctx.getChat().then(ctx.getChatMembersCount)
})

const questions: string[] = [
    "плюс 5  社会评价",
    "минус 5  社会评价"
]

//5316592324677992605
//412761726

bot.on("message", async (ctx) => {
    if ("photo" in ctx.message) {

        const pollId = await bot.telegram.sendPoll(ctx.chat.id, pollTracker.setName("оцени мем"), questions, { is_anonymous: false, open_period: 10 })
            .then(c => c.poll.id)

        //  const finalDate = new Date().getTime() + 1000 * 10
        const finalDate = +moment().add(11, "seconds")
        const poll = { pollId: pollId, userId: ctx.from.id, votes: 0, startDate: +moment(), finalDate, chatId: ctx.chat.id }
        groupsRepo.getSocialCreditById(poll.userId)
        pollRepo.insertPoll(poll)
        pollTracker.register(pollId, 10)
    }
})

bot.on("poll_answer", (ctx) => {
    const curPoll = pollRepo.findPoll(ctx.pollAnswer.poll_id)
    if (curPoll) {
        const updated = {
            ...curPoll,
            votes: ctx.pollAnswer.option_ids[0] === 0
                ? curPoll.votes + 1
                : curPoll.votes - 1
        }

        pollRepo.updatePoll(updated)
    }
})

pollTracker.on("poll_ended", (pollId) => {
    const poll = pollRepo.findPoll(pollId)
    if (poll) {
        const user = poll.userId

        if (poll?.votes! >= 1) {
            groupsRepo.updateSocialCredit(user!, 5)
        }
        if (poll?.votes! <= -1) {
            groupsRepo.updateSocialCredit(user!, -5)
        }
        if (poll?.votes! === 0) {
            groupsRepo.updateSocialCredit(user!, 0)
        }

        const findUSer = groupsRepo.getSocialCreditById(user).then(
            sr => (`${user}: ${sr}`)
        )

        pollTracker.setName(String(user))

        groupsRepo.getSocialCreditById(user).then(
            sr => api.sendMessage(poll.chatId, `${user}: ${sr}`)
        )
    }
})

bot.action("asdsdasd", (ctx) => {
    ctx.answerCbQuery()
    console.log("asdasdasd")
})

bot.on("text", () => {
    console.log("text")
})

bot.on("photo", (ctx) => {
    if (ctx.message.photo) {
        console.log(3)
    }
})

bot.command("poll", (ctx) => {
    api.sendPoll(ctx.chat.id, "Привет", questions, { is_anonymous: false })
})

bot.command("getuser", (ctx) => {
    const userId = ctx.from.id;

    const socialCreditPromise = groupsRepo.getSocialCreditById(userId);

    socialCreditPromise.then(num => {
        ctx.reply(String(num))
    })
})

// Обработчик простого текста
bot.on("text", (ctx) => {
    return ctx.reply(ctx.message.text);
});

const groupRepository: number[] = []

// bot.on("new_chat_members", async (ctx) => {
//     const groupId = ctx.chat.id
//     const type = ctx.chat.type

//     if (type === "group") {
//         const ourGroup = groupsRepo.getGroupById(groupId)

//         const user = await ctx.getChatMember(ctx.from.id)

//         ourGroup.update(participatns: [...user])
//     }
// })

// bot.on("new_chat_members", async (ctx) => {
//     const groupId = ctx.chat.id
//     const type = ctx.chat.type

//     const p =  ctx.getChatMember()

//     if (type === "group") {
//         const ourGroup = groupRepository.getGroupById(groupId)

//         const user = await ctx.getChatMember()

//         ourGroup.update(participatns: [...user])
//     }

//     const newMember = ctx.chatMember
// })

// Запуск бота
bot.launch()
    .then(() => console.log("Started"));

