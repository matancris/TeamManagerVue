// import { teamService } from './teamServiceFirebase';

import firebase from 'firebase/app'
import '../../firebase.config'
export const db = firebase.firestore()
const collection = db.collection('user')



export const userService = {
    // getById,
    // save,
    checkLogin,
    login,
    getUser,
    logout,
    // query,
    // remove,
    addReqToAdmin,
    clearReqToAdmin
}

const STORAGE_KEY = 'loggedinUser'


// function query() {
//     return Promise.resolve(users)
// }

// function remove(id) {
//     const idx = users.findIndex(user => user._id === id)
//     users.splice(idx, 1);
//     return Promise.resolve();
// }

// function getById(userId) {
//     const user = users.find(user => user._id === userId)
//     if (!user) return Promise.reject('Uknown User')
//     return Promise.resolve(user);
// }

async function checkLogin({ username, password }) {
    try {
        const userToReturn = await collection
            .where('username', '==', username)
            .where('password', '==', password)
            .get()
            .then(res => res.docs[0].data())
        delete userToReturn.password
        return Promise.resolve(userToReturn)
    } catch (err) {
        console.log(err);
    }
    // var userToReturn = users.find(user => user.username === username && user.password === password)
    // if (userToReturn) {
    //     userToReturn = { ...userToReturn }
    //     delete userToReturn.password;
    // }
}

// function save(user) {
//     if (user._id) {
//         const idx = users.findIndex(currUser => currUser._id === user.id)
//         user.updatedAt = Date.now();
//         users[idx] = { ...users[idx], ...user }
//     } else {
//         user._id = _makeId()
//         user.createdAt = Date.now();
//         user.isAdmin = false;
//         users.unshift(user);
//     }
//     return user
// }

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

async function addReqToAdmin(memberReq) {
    const res = await collection.where('isAdmin', '==', true).get().then(res => res.docs[0])
    const admin = { ...res.data(), _id: res.id }
    admin.requests.push(memberReq)
    await updateUser(admin)
    // const admin = users.find(user => user.isAdmin)
    return admin.requests
}

async function clearReqToAdmin(memberId) {
    const res = await collection.where('isAdmin', '==', true).get().then(res => res.docs[0])
    const admin = { ...res.data(), _id: res.id }
    admin.requests = admin.requests.filter(req => req.member._id !== memberId)
    await updateUser(admin)
}

async function updateUser(updatedUser) {
    console.log('updateUser ~ updatedUser', updatedUser)
    try {
        await collection.doc(updatedUser._id).update(updatedUser)
    } catch (err) {
        console.error('Error updating member: ', err);
        throw new Error()
    }
    return Promise.resolve(updatedUser)
}



// function getGuestMode() {
//     return {
//         username: 'Guest',
//         fullName: 'Best Guest',
//         imgUrl: 'https://res.cloudinary.com/daqs7x8my/image/upload/v1600683124/ko8ia4xof4zz3yspbgoc.png',
//         _id: _makeId()
//     }
// }

// function _makeId(length = 5) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }

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



// Get users in async way for getting the mamberId property from the teamService

// INITIAL STORE THE DATA
// let users;
// (async function() {
//     users = [
//         {
//             fullname: 'Hadas Priel',
//             username: 'Hadas',
//             password: 'hadas',
//             memberId: await _getMemberIdBy('Hadas'),
//             imgUrl: 'hadas-img.png',
//             isAdmin: false
//         },
//         {
//             fullname: 'Matan Crispel',
//             username: 'Matan',
//             password: 'matan',
//             memberId: await _getMemberIdBy('Matan'),
//             imgUrl: 'matan-img.png',
//             isAdmin: true,
//             requests: []
//         }
//     ]
//     users.forEach(user => {
//         try {
//           collection.add(user)
//         } catch (err) {
//           console.log('error while adding user', err);
//           throw new Error()
//         }
//       })
// })()

// async function _getMemberIdBy(username) {
//     const members = await teamService.query()
//     const member = members.find((member) => member.name === username)
//     return await member._id
// }