const expect = require('expect');

const { createMessage } = require('./message');

describe('createMessage', () => {
    it('should create a new message object', () => {
        var from = 'darren@test.com';
        var text = 'This is a new message';
        var message = createMessage(from, text);
        expect(message).toMatchObject({ from, text });
        expect(typeof message.createdAt).toBe('number');
    });
});