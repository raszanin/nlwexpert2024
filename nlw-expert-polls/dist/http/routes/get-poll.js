"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoll = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const redis_1 = require("../../lib/redis");
async function getPoll(app) {
    app.get('/polls/:pollId', async (request, reply) => {
        const getPollParams = zod_1.z.object({
            pollId: zod_1.z.string().uuid()
        });
        const { pollId } = getPollParams.parse(request.params);
        const poll = await prisma_1.prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: {
                    select: {
                        id: true,
                        title: true,
                    },
                }
            }
        });
        if (!poll) {
            return reply.status(404).send({ message: 'Poll not found' });
        }
        ;
        const result = await redis_1.redis.zrange(pollId, 0, -1, 'WITHSCORES');
        const votes = result.reduce((obj, line, index) => {
            if (index % 2 === 0) {
                const score = result[index + 1];
                Object.assign(obj, { [line]: Number(score) });
            }
            return obj;
        }, {});
        return reply.send({
            poll: {
                id: poll.id,
                title: poll.title,
                options: poll.options.map(option => ({
                    id: option.id,
                    title: option.title,
                    score: (option.id in votes) ? votes[option.id] : 0
                }))
            }
        });
    });
}
exports.getPoll = getPoll;
