const expect = require('expect');

const { createMessage, createLocationMessage } = require('./message');

describe('createMessage', () => {
    it('should create a new message object', () => {
        var from = 'Darren';
        var text = 'This is a new message';
        var message = createMessage(from, text);
        expect(message).toMatchObject({ from, text });
        expect(typeof message.createdAt).toBe('number');
    });
});

describe('createMessage', () => {
    it('should create a new location message object', () => {
        var from = 'Darren';
        var latitude = 123;
        var longitude = 456;
        var message = createLocationMessage(from, latitude, longitude);
        expect(message).toMatchObject({ 
            from, 
            url: `https://www.google.com/maps?q=${latitude},${longitude}` 
        });
        expect(typeof message.createdAt).toBe('number');
    });
});