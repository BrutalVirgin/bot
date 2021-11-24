import { Telegraf, Telegram } from "telegraf";
import { InMemoryRepository } from "./repos/group-repo"

const bot = new Telegraf("2115931653:AAHDDjLXvDb7bYKkzu-qfMZid8wVYKF9R_k")
const api = new Telegram("")
import { TelegramBot } from "node-telegram-bot-api"
const groupsRepo = new InMemoryRepository()

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
    ctx.getChat().then(console.log)
})

const questions: string[] = [
    "ti pidor?",
    "ny da"
]
bot.command("poll", (ctx) => {
    api.sendPoll(ctx.chat.id, "дарова", questions)
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

