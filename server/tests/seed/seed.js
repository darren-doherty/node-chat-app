const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');

const {User} = require('./../../models/user');

const UserOneId = new ObjectID();
const UserTwoId = new ObjectID();
const initUsers = [{
    _id: UserOneId,
    email: 'darren@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: UserOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: UserTwoId,
    email: 'darren1@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: UserTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
       var userOne = new User(initUsers[0]).save();
       var userTwo = new User(initUsers[1]).save();

       return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {initUsers, populateUsers};