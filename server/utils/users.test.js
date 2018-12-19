const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
    var usersList;

    beforeEach(() => {
        usersList = new Users();
        usersList.users = [{
            id: 1,
            name: 'Darren',
            room: 'Room A'
        },
        {
            id: 2,
            name: 'John',
            room: 'Room B'
        },
        {
            id: 3,
            name: 'James',
            room: 'Room A'
        }];
    });

    it('should add a new user to the list', () => {
        var usersList = new Users();
        var user = {
            id: 1,
            name: 'Darren',
            room: 'Room A'
        };
        var result = usersList.addUser(user.id, user.name, user.room);
        expect(usersList.users).toEqual([user]);
        expect(result).toMatchObject(user);
    });

    it('should remove the user', () => {
        var user = usersList.users[0];
        var result = usersList.removeUser(1);
        expect(result).toMatchObject(user);
        expect(usersList.users.length).toEqual(2);
    });

    it('should not remove the user', () => {
        var result = usersList.removeUser(4);
        expect(result).toBeFalsy();
        expect(usersList.users.length).toEqual(3);
    });

    it('should get the user', () => {
        var result = usersList.getUser(1);
        expect(result).toMatchObject(usersList.users[0]);
    });

    it('should not get the user', () => {
        var result = usersList.getUser(4);
        expect(result).toBeFalsy();
    });

    it('should return names for Room A', () => {
        var namesList = ['Darren', 'James'];
        var result = usersList.getUserList('Room A');
        expect(result).toMatchObject(namesList);
    });
});