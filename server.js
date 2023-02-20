const { Telegraf, Markup } = require('telegraf')
const axios = require('axios')
require('dotenv').config()
const commands = require('./const')

const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN
const bot = new Telegraf(telegram_bot_token)

const apiKey = process.env.API_KEY
const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: { apiKey }
}

bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears(/hi|hello/i, (ctx) => ctx.reply('Hey there'))

bot.help((ctx) => ctx.reply(commands.commands))

bot.command('start', async (ctx) => {
    console.log(ctx.message.from.first_name)
    try {
        await ctx.replyWithHTML(`<i><b>Hello ${ctx.message.from.first_name ? ctx.message.from.first_name : `guest`}!</b></i>
Welcome to Currency Bot. 
The place that you can check the current price of money.

Insert amount of money
        `)
    } catch (error) {
        console.log(error)
    }
})

let amount = 0
bot.hears(/^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/, async (ctx) => {
    try {
        amount = ctx.message.text
        console.log(amount)
        await ctx.replyWithHTML(`Enter <i>FROM</i> currency?`,
            Markup.inlineKeyboard(
                [
                    Markup.button.callback('ILS', 'ils'),
                    Markup.button.callback('USD', 'usd'),
                    Markup.button.callback('EURO', 'euro'),
                ]
            ),
            // {
            //     disable_web_page_preview: true
            // }
        )
    } catch (error) {
        console.log(error)
    }
})

let fromCurrency = ''
bot.action(/^(ils|usd|euro)$/, async (ctx) => {
    try {
        active = true
        fromCurrency = ctx.update.callback_query.data
        console.log(ctx.update.callback_query.data)
        await ctx.replyWithHTML(`Enter <i>TO</i> currency?`,
            Markup.inlineKeyboard(
                fromCurrency == 'ils' ? [Markup.button.callback('USD', 'tocurrencyusd'), Markup.button.callback('EURO', 'tocurrencyeuro')] :
                    fromCurrency == 'usd' ? [Markup.button.callback('ILS', 'tocurrencyils'), Markup.button.callback('EURO', 'tocurrencyeuro')] :
                        [Markup.button.callback('ILS', 'tocurrencyils'), Markup.button.callback('USD', 'tocurrencyusd')]
            ),
            // {
            //     disable_web_page_preview: true
            // }
        )
    } catch (error) {
        console.log(error)
    }
})

let toCurrency = ''
bot.action(/^tocurrency/, async (ctx) => {
    try {
        const input = ctx.update.callback_query.data
        toCurrency = input.replace('tocurrency', '')
        console.log(toCurrency)
        await ctx.replyWithHTML(`You want to check ${amount} from ${fromCurrency.toUpperCase()} to ${toCurrency.toUpperCase()}?`,
            Markup.inlineKeyboard(
                [
                    Markup.button.callback('Yes?', 'yes'),
                    Markup.button.callback('No?', 'no')
                ]
            ),
            // {
            //     disable_web_page_preview: true
            // }
        )
    } catch (error) {
        console.log(error)
    }
})

//YES
let total = 0
bot.action('yes', async (ctx) => {
    try {
        await ctx.answerCbQuery()
        console.log('yes')
        if (amount === 0 || toCurrency === '' || fromCurrency === '') {
            // await ctx.replyWithSticker('file:///C:/Users/Katya%20Ru/Downloads/244604348921808888.webp')
            // await ctx.sendPhoto('./no-no-no.jpg')
            await ctx.replyWithHTML(`No no no, need all the fields!!! Epta!!
To start again insert amount`)
        } else {
            if (fromCurrency == "ils" && toCurrency == "usd") {
                total = amount / 3.57
                console.log(total)
                await ctx.replyWithHTML(`Love you !!!
            From: ${fromCurrency.toUpperCase()}
            To: ${toCurrency.toUpperCase()}
            Total: ${total}`
                )
            } else if (fromCurrency == "ils" && toCurrency == "eoru") {
                total = amount / 3.82
                console.log(total)
                await ctx.replyWithHTML(`Love you !!!
            From: ${fromCurrency.toUpperCase()}
            To: ${toCurrency.toUpperCase()}
            Total: ${total}`
                )
            } else if (fromCurrency == "usd" && toCurrency == "ils") {
                total = amount * 3.57
                console.log(total)
                await ctx.replyWithHTML(`Love you !!!
            From: ${fromCurrency.toUpperCase()}
            To: ${toCurrency.toUpperCase()}
            Total: ${total}`
                )
            } else if (fromCurrency == "usd" && toCurrency == "euro") {
                total = amount / 1.07
                console.log(total)
                await ctx.replyWithHTML(`Love you !!!
            From: ${fromCurrency.toUpperCase()}
            To: ${toCurrency.toUpperCase()}
            Total: ${total}`
                )
            } else if (fromCurrency == "euro" && toCurrency == "ils") {
                total = amount * 3.82
                console.log(total)
                await ctx.replyWithHTML(`Love you !!!
            From: ${fromCurrency.toUpperCase()}
            To: ${toCurrency.toUpperCase()}
            Total: ${total}`
                )
            } else if (fromCurrency == "euro" && toCurrency == "usd") {
                total = amount * 1.07
                console.log(total)
                await ctx.replyWithHTML(`Love you !!!
            From: ${fromCurrency.toUpperCase()}
            To: ${toCurrency.toUpperCase()}
            Total: ${total}`
                )
            }
            // const { data } = await axios.get(`https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`, requestOptions)

            // const { success, query, date, result } = data
            // console.log(data)
            // if (success) {
            //     await ctx.replyWithHTML(`
            //     From: ${query.from}
            //     To: ${query.to}
            //     Date: ${date}
            //     Total: ${result}
            //     `,
            //         {
            //             disable_web_page_preview: true
            //         })
            // } else {
            //     await ctx.replyWithHTML(`No data, sorry!`)
            // }
            // await ctx.replyWithHTML(`Love you !!!
            // From: ${fromCurrency.toUpperCase()}
            // To: ${toCurrency.toUpperCase()}
            // Total: ${total}`
            // )
        }
    } catch (error) {
        console.log(error)
    }
})

//NO
bot.action('no', async (ctx) => {
    try {
        console.log(`no`)
        await ctx.answerCbQuery()
        i = 0, toCurrency = '', fromCurrency = ''
        await ctx.replyWithHTML('Fuck You!!',
            {
                disable_web_page_preview: true
            })
    } catch (error) {
        console.log(error)
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))