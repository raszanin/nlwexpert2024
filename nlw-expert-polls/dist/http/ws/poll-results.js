"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollResult = void 0;
const zod_1 = require("zod");
const voting_pub_sub_1 = require("../../utils/voting-pub-sub");
async function pollResult(app) {
    app.get('/polls/:pollId/results', { websocket: true }, async (connection, request) => {
        const getPollParams = zod_1.z.object({
            pollId: zod_1.z.string().uuid()
        });
        const { pollId } = getPollParams.parse(request.params);
        voting_pub_sub_1.voting.subscribe(pollId, (message) => {
            connection.socket.send(JSON.stringify(message));
        });
    });
}
exports.pollResult = pollResult;
