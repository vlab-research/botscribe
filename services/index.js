const Kafka = require('node-rdkafka')
const Chatbase = require(process.env.CHATBASE_BACKEND)
const {KeyedStreamer, PromiseStream} = require('@vlab-research/steez')

const kafkaOpts = {
  'metadata.broker.list': `${process.env.KAFKA_BROKER}:${process.env.KAFKA_PORT}`,
  'retry.backoff.ms': 200,
  'socket.keepalive.enable': true,
  'session.timeout.ms': 60000,
  'group.id': process.env.KAFKA_GROUP_ID,
  'client.id': process.env.KAFKA_GROUP_ID,
  'enable.auto.commit': false
}

const stream = new Kafka.createReadStream(kafkaOpts,
                                          {'auto.offset.reset': 'earliest'},
                                          { topics: [process.env.KAFKA_TOPIC]})
const chatbase = new Chatbase()

const write = async (msg) => {
  const val = msg.value.toString()
  const key = msg.key.toString()
  const date = new Date(+msg.timestamp.toString())
  await chatbase.put(key, val, date)
  stream.consumer.commitMessage(msg)
}


const subStreamer = () => new PromiseStream(write, {
  highWaterMark: +process.env.BOTSCRIBE_SUBSTREAM_SIZE || 50
})
const dbStream = new KeyedStreamer(m => m.key.toString(),
                                        subStreamer,
                                        { highWaterMark: 250 })

stream
  .pipe(dbStream)
  .on('error', err => {
    console.error(err)
  })


// ------- SHUT DOWN --------
// TODO: Cleanup!
const signals = {
  'SIGHUP': 1,
  'SIGINT': 2,
  'SIGTERM': 15
}

for (let [signal, value] in signals) {
  process.on(signal, () => {
    stream.consumer.disconnect()
    stream.consumer.on('disconnected', () => {
      process.exit(128 + value)
    })
  })
}
