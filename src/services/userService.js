import { teamService } from './teamService';
import utilService from './utilService';


export const userService = {
    getById,
    save,
    checkLogin,
    login,
    getUser,
    query,
    remove,
    logout,
    addReqToAdmin,
    clearReqToAdmin
}

const STORAGE_KEY = 'loggedinUser'

let users;


// Get users in async way for getting the mamberId property from the teamService

(async () => {
    users = [
        {
            id: utilService.makeId(),
            fullname: 'Hadas Priel',
            username: 'Hadas',
            password: 'hadas',
            memberId: await _getMemberIdBy('Hadas'),
            imgUrl: 'hadas-img.png',
            isAdmin: false
        },
        {
            id: utilService.makeId(),
            fullname: 'Matan Crispel',
            username: 'Matan',
            password: 'matan',
            memberId: await _getMemberIdBy('Matan'),
            imgUrl: 'matan-img.png',
            isAdmin: true,
            requests: []
        }
    ]
})()


function query() {
    return Promise.resolve(users)
}

function remove(id) {
    const idx = users.findIndex(user => user._id === id)
    users.splice(idx, 1);
    return Promise.resolve();
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('Uknown User')
    return Promise.resolve(user);
}

function checkLogin({ username, password }) {
    var userToReturn = users.find(user => user.username === username && user.password === password)
    if (userToReturn) {
        userToReturn = { ...userToReturn }
        delete userToReturn.password;
    }
    return Promise.resolve(userToReturn)
}

function save(user) {
    if (user._id) {
        const idx = users.findIndex(currUser => currUser._id === user.id)
        user.updatedAt = Date.now();
        users[idx] = { ...users[idx], ...user }
    } else {
        user._id = _makeId()
        user.createdAt = Date.now();
        user.isAdmin = false;
        users.unshift(user);
    }
    return user
}

async function login(userCard) {
    const user = await checkLogin(userCard)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function logout() {
    sessionStorage.clear();
}

function getUser() {
    var user = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    // if (!user) user = getGuestMode();
    // sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    // return getGuestMode();
    return user;
}

function addReqToAdmin(memberReq) {
    const admin = users.find(user => user.isAdmin)
    admin.requests.push(memberReq)
    return admin.requests
}

function clearReqToAdmin(memberId) {
    const admin = users.find(user => user.isAdmin)
    admin.requests = admin.requests.filter(req => req.member._id !== memberId)
    console.log('clearReqToAdmin ~ admin.requests', admin.requests)
}

// function getGuestMode() {
//     return {
//         username: 'Guest',
//         fullName: 'Best Guest',
//         imgUrl: 'https://res.cloudinary.com/daqs7x8my/image/upload/v1600683124/ko8ia4xof4zz3yspbgoc.png',
//         _id: _makeId()
//     }
// }

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

// function _saveToFile() {
//     return new Promise((resolve, reject) => {
//         const str = JSON.stringify(users, null, 2);
//         fs.writeFile('data/user.json', str, function (err) {
//             if (err) {
//                 console.log('Had Problems', err)
//                 return reject(new Error('Cannot update User file'));
//             }
//             resolve()
//         });
//     });
// }

async function _getMemberIdBy(username) {
    const members = await teamService.query()
    const member = members.find((member) => member.name === username)
    return await member._id
}