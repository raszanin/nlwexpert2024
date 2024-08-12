import fastify from 'fastify';
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import cors from '@fastify/cors'
import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';
import { pollResult } from './ws/poll-results';

const app = fastify();

app.register(cors, { 
  // put your options here
})

app.register(cookie, {
  secret: 'my-secret-key-polls-app',
  hook: 'onRequest'
});

app.register(websocket)



app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(pollResult)

app.listen({port: 3333}).then(() => {
  console.log('HTTP server is running...');
});