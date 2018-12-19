const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should create verify a valid string was passed in', () => {
        var str = 'Darren';
        var result = isRealString(str);
        expect(result).toBe(true);
    });

    it('should reject non-string values', () => {
        var str = 7;
        var result = isRealString(str);
        expect(result).toBe(false);
    });

    it('should reject strings with only spaces', () => {
        var str = '    ';
        var result = isRealString(str);
        expect(result).toBe(false);
    });
});