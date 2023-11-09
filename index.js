const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf('6984946740:AAHGVy2Z4Kc2RzPgCYA78Nb3zfkyDSPS_UI')
const session = require('telegraf/session')
const axios = require('axios')
const text1 = 'Labcenter.uz - ваш надежный партнер в заботе о здоровье. Мы предлагаем широкий спектр лабораторных и диагностических услуг, основанных на передовых технологиях и профессиональном подходе. Наши квалифицированные специалисты готовы обеспечить вас точными результатами и высоким уровнем сервиса. Здоровье вашей семьи - наш приоритет'

bot.use(session())
bot.on('text', ctx => {
    const text = ctx.message.text
    if(text == '/start'){
        ctx.session.active = false
        ctx.replyWithHTML(`Привет ${ctx.from.first_name}, добро пожаловать 🎉\n\n${text1}`,
            Markup.keyboard([
                ['📥 Получить результаты анализов']
            ]).oneTime().resize().extra()
        )
    } else if(text == '📥 Получить результаты анализов'){
        ctx.session.active = true
        ctx.reply('Введите код, указанный на Вашем чеке', 
            Markup.keyboard([['Назад в главное ↩️']]).oneTime().resize().extra()
        )
    } else if(text == 'Назад в главное ↩️'){
        ctx.session.active = false
        ctx.replyWithHTML(`Привет ${ctx.from.first_name}, добро пожаловать 🎉\n\n${text1}`,
            Markup.keyboard([
                ['📥 Получить результаты анализов']
            ]).oneTime().resize().extra()
        )
    } else if(ctx.session.active == true){
        axios.post('http://result.labcenter.uz/result_uz_post', {
            barcode: ctx.message.text
        }).then(res => {
            ctx.deleteMessage(ctx.message.id)
            ctx.reply(res.data)
            ctx.session.active = false
        })
    }
})

bot.launch()