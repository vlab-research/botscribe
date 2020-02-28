const {BotSpine} = require('@vlab-research/botspine')
const Chatbase = require(process.env.CHATBASE_BACKEND)
const {pipeline} = require('stream')

const chatbase = new Chatbase()

const write = async ({key, value, timestamp}) => {
  const date = new Date(+timestamp)
  const res = await chatbase.put(key, value, date)
  return res
}

const spine = new BotSpine('botscribe')

pipeline(spine.source(),
         spine.transform(write),
         spine.sink(),
         err => console.error(err))
