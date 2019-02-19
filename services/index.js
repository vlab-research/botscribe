const Kafka = require('node-rdkafka');

// Create a kafka consumer to retrieve messages
const consumer = new Kafka.KafkaConsumer({
  'metadata.broker.list': `${process.env.KAFKA_BROKER}:${process.env.KAFKA_PORT}`,
  'retry.backoff.ms': 200,
  'socket.keepalive.enable': true,
  'session.timeout.ms': 60000,
  'group.id': 'kafka' // TODO: make it dynamic to every group 
}, {});

consumer.connect()

consumer.on('event.error', err => {
  console.error('Error from consumer:');
  console.error(err);
})

consumer
  .on('ready', (err) => {
    try {
      consumer
        .subscribe([ process.env.KAFKA_TOPIC ])
        .consume();
    } catch (err) {
      console.log('The following error occurs subscribing a topic: ', err);
    }
  })
  .on('data', message => {
    // Output the actual message contents
    console.log('INCOMING MESSAGE: ', message.value.toString());
    // TODO: add logic to write key/value messages into database
  });
