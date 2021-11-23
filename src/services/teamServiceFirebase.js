// import { storageService } from './storageService';
import utilService from './utilService';

// Get a Firestore instance
import firebase from 'firebase/app'
import '../../firebase.config'
// import 'firebase/firestore'
export const db = firebase.firestore()
const collection = db.collection('member')

export const teamService = {
  query,
  generateCalenders,
  updateCalender,
  updateMember,
  addMember,
  removeMember,
  mergeMemberCal
}

const staticData = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednsday', 'Thersday'],
  hours: _getHours(),
  tasks: ['Queue', 'Leads', 'Opening', 'Personal', 'MisterBit', 'Free', 'Other']
}


async function query() {
  const members = [];
  try {
    const res = await collection.get()
    console.log('query ~ res', res)
    res.forEach(doc => members.push({ ...doc.data(), _id: doc.id }));
    console.log('query ~ members', members)
    return members
  } catch (err) {
    console.log('in query =>', err);
    throw new Error()
  }
}

async function addMember(name) {
  const memberToAdd = {
    name,
    weekTasksMap: _createWeekTasksMap(),
    tasks: ['Queue', 'Free']
  }
  try {
    collection.add(memberToAdd)
  } catch (err) {
    console.log('error while adding task', err);
    throw new Error()
  }
  return Promise.resolve(memberToAdd)
}

async function removeMember(id) {
  try {
    const removedMember = await collection.doc(id).delete()
    console.log(removedMember);
  } catch (err) {
    console.error('Error removing member: ', err);
    throw new Error()

  }
}

async function updateCalender(data) {
  const members = await query()
  const { memberId, day, fromHour, toHour, task } = data
  const currMember = members.find(currMember => currMember._id === memberId)

  // Logic to allow the user insert range of hours instead of only accurate hour
  if (+fromHour.substr(0, 2) > +toHour.substr(0, 2)) {
    console.log('invalid range');
  } else {
    for (const hour in currMember.weekTasksMap[day]) {
      if (+hour.substr(0, 2) >= +fromHour.substr(0, 2) && +hour.substr(0, 2) < +toHour.substr(0, 2)) {
        currMember.weekTasksMap[day][hour] = task
      }
    }
  }
  await updateMember(currMember)
  return Promise.resolve(members)
}

async function updateMember(updatedMember) {
  try {
    await collection.doc(updatedMember._id).update(updatedMember)
  } catch (err) {
    console.error('Error updating member: ', err);
    throw new Error()
  }
  return Promise.resolve(updatedMember)
}

async function generateCalenders() {
  console.log('GENERATING');
  const members = await query()
  const weekData = { ...staticData }
  let days = [...weekData.days]

  members.forEach(async (member) => {
    member.weekTasksMap = _createWeekTasksMap()
    let randIdx = utilService.getRandomInt(0, days.length)
    const randDay = days.splice(randIdx, 1)[0]

    // ***Random Day For the Opening Task*** 
    if (member.tasks.includes('Opening')) {
      for (let i = 0; i <= 5; i++) { // For loop for marking the Opening task consistantly at the same hours. This method can be replaced using Object.values etc.
        let hour = ((i + 8) < 10) ? '0' + (i + 8) : (i + 8); // Condition because of the '0' added if the hour is before 10.
        hour += ':00'
        console.log('members.forEach ~ hour', hour)
        member.weekTasksMap[randDay][hour] = 'Opening'
        member.weekTasksMap[randDay]['18:00'] = 'Free'
        member.weekTasksMap[randDay]['19:00'] = 'Free'
      }
    }

    console.log('teamMembers.forEach ~  member.weekTasksMap', member.weekTasksMap)
    // if (!days.length) return acc // returning the memberIdx to indicate where to start the shift in the next week. If we donwt want every member get the Opening task every week.

    // Schedualing Opening task for every member as default 
    if (!days.length) days = [...weekData.days]


    // ***Random Schedual For the Leads Task*** 
    if (member.tasks.includes('Leads')) {
      member.weekTasksMap['Tuesday']['17:00'] = 'Leads' // Set this hour as leads because of the Open evenings
      weekData.days.forEach(day => {
        let randHour = utilService.getRandomInt(10, 18)
        if (member.weekTasksMap[day][randHour + ':00'] === 'Opening') randHour = utilService.getRandomInt(13, 18)
        member.weekTasksMap[day][randHour + ':00'] = 'Leads'
        member.weekTasksMap[day][(randHour + 1) + ':00'] = 'Leads'
      })
    }
    try {
      await updateMember(member)
    } catch (err) {
      console.error('Error updating member: ', err);
      throw new Error(err)
    }
  })
  return Promise.resolve(members)
}

async function mergeMemberCal(memberReq) {
  try {
    const member = await collection.doc(memberReq.member._id).get().then(res => res.data())
    console.log('mergeMemberCal ~ member', member)
    const { weekTasksMap } = member;
    console.log('mergeMemberCal ~ weekTasksMap', weekTasksMap)
    for (const day in weekTasksMap) {
      for (const hour in weekTasksMap[day]) {
        if (memberReq.reqCal[day][hour] !== '-') {
          weekTasksMap[day][hour] = memberReq.reqCal[day][hour]
        }
      }
    }
    await updateMember(member)
    return Promise.resolve(member)
  } catch (err) {
    console.error('Error updating member: ', err);
    throw new Error(err)
  }
}



// Local Functions

function _getHours() {
  const hours = [];
  for (let i = 8; i <= 20; i++) {
    let hourStr = `${i}:00`
    if (i < 10) hourStr = '0' + hourStr
    hours.push(hourStr)
  }
  return hours;
}

function _createWeekTasksMap(isEmptyMap = false) {
  const weekTasksMap = staticData.days.reduce((acc, day) => {
    acc[day] = _getHours().reduce((acc, hour) => {
      if (!isEmptyMap) {
        if (+hour.substr(0, 2) >= 11 && +hour.substr(0, 2) < 20) {
          acc[hour] = 'Queue'
        } else {
          acc[hour] = 'Free'
        }
        return acc

      } else {
        acc[hour] = '-'
        return acc
      }
    }, {})
    return acc
  }, {})
  return weekTasksMap
}









// export const teamService = {
//     getTeamMembers,
//     getWeekData,
//     updateCalender,
//     updateMember,
//     getMemberByid,
//     addMember,
//     generateCalenders,
//     removeMember,
//     getWeekTasksMap,
//     mergeMemberCal
// }

// const staticData = {
//     days: ['Sunday', 'Monday', 'Tuesday', 'Wednsday', 'Thersday'],
//     hours: _getHours(),
//     tasks: ['Queue', 'Leads', 'Opening', 'Personal', 'MisterBit', 'Free', 'Other']
// }

// const teamMembers = [
//     {
//         id: utilService.makeId(),
//         name: 'Hadas',
//         weekTasksMap: _createWeekTasksMap(),
//         tasks: ['Queue', 'Opening', 'Leads']
//     },
//     {
//         id: utilService.makeId(),
//         name: 'Stav',
//         weekTasksMap: _createWeekTasksMap(),
//         tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//     },
//     {
//         id: utilService.makeId(),
//         name: 'Shachar',
//         weekTasksMap: _createWeekTasksMap(),
//         tasks: ['Queue', 'Opening', 'MisterBit']
//     },
//     {
//         id: utilService.makeId(),
//         name: 'Guy',
//         weekTasksMap: _createWeekTasksMap(),
//         tasks: ['Queue', 'Opening', 'Leads']
//     },
//     {
//         id: utilService.makeId(),
//         name: 'Roi',
//         weekTasksMap: _createWeekTasksMap(),
//         tasks: ['Queue', 'Opening', 'MisterBit']
//     },
//     {
//         id: utilService.makeId(),
//         name: 'Matan',
//         weekTasksMap: _createWeekTasksMap(),
//         tasks: ['Queue', 'Opening']
//     }
// ];

// async function updateCalender(data) {
//     const members = await getTeamMembers()
//     const { memberId, day, fromHour, toHour, task } = data
//     const currMember = members.find(currMember => currMember.id === memberId)

//     // Logic to allow the user insert range of hours instead of only accurate hour
//     if (+fromHour.substr(0, 2) > +toHour.substr(0, 2)) {
//         console.log('invalid range');
//     } else {
//         for (const hour in currMember.weekTasksMap[day]) {
//             if (+hour.substr(0, 2) >= +fromHour.substr(0, 2) && +hour.substr(0, 2) < +toHour.substr(0, 2)) {
//                 currMember.weekTasksMap[day][hour] = task
//             }
//         }
//     }

//     _saveMembers(members)
//     return Promise.resolve(members)
// }

// async function updateMember(updatedMember) {
//     const members = await getTeamMembers()
//     const idx = members.findIndex(member => member.name === updatedMember.name)
//     members.splice(idx, 1, updatedMember)
//     _saveMembers(members)
//     return Promise.resolve(updatedMember)
// }

// async function addMember(name) {
//     const members = await getTeamMembers()
//     const memberToAdd = {
//         id: utilService.makeId(),
//         name,
//         weekTasksMap: _createWeekTasksMap(),
//         tasks: ['Queue', 'Free']
//     }
//     members.push(memberToAdd)
//     _saveMembers(members)
//     return Promise.resolve(memberToAdd)
// }

// async function removeMember(id) {
//     const members = await getTeamMembers()
//     const idx = members.findIndex(member => member._id === id)
//     members.splice(idx, 1)
//     _saveMembers(members)
// }

// function getTeamMembers() {
//     const members = storageService.load('teamMembers') || teamMembers
//     return Promise.resolve(members);
// }

// async function getMemberByid(id) {
//     const members = await getTeamMembers()
//     const member = await members.find(member => member._id === id)
//     return Promise.resolve(member)
// }

// function getWeekData() {
//     return staticData
// }

// function getWeekTasksMap(isEmptyMap) {
//     return _createWeekTasksMap(isEmptyMap)
// }


// async function mergeMemberCal(memberReq) {
//     const members = await getTeamMembers()
//     const idx = members.findIndex(member => member._id === memberReq.member._id)
//     const { weekTasksMap } = members[idx];
//     console.log('mergeMemberCal ~ weekTasksMap', weekTasksMap)
//     for (const day in weekTasksMap) {
//         for (const hour in weekTasksMap[day]) {
//             if ( memberReq.reqCal[day][hour] !== '-') {
//                 weekTasksMap[day][hour] = memberReq.reqCal[day][hour]
//             }
//         }
//     }
//     _saveMembers(members)
//     return Promise.resolve(members[idx])
// }



// // Local Functions

// function _getHours() {
//     const hours = [];
//     for (let i = 8; i <= 20; i++) {
//         let hourStr = `${i}:00`
//         if (i < 10) hourStr = '0' + hourStr
//         hours.push(hourStr)
//     }
//     return hours;
// }

// function _createWeekTasksMap(isEmptyMap = false) {
//     const weekTasksMap = staticData.days.reduce((acc, day) => {
//         acc[day] = _getHours().reduce((acc, hour) => {
//             if (!isEmptyMap) {
//                 if (+hour.substr(0, 2) >= 11 && +hour.substr(0, 2) < 20) {
//                     acc[hour] = 'Queue'
//                 } else {
//                     acc[hour] = 'Free'
//                 }
//                 return acc

//             } else {
//                 acc[hour] = '-'
//                 return acc
//             }
//         }, {})
//         return acc
//     }, {})
//     return weekTasksMap
// }



// function _saveMembers(members) {
//     storageService.store('teamMembers', members)

// }


// /*  DEPRECATED  */

// // async function getMemberHoursMapBy(task) {
// //     const members = await getTeamMembers()
// //     const memberHoursMap = members.reduce((acc, member) => {
// //         let hoursCount = 0;
// //         const { weekTasksMap } = member;
// //         for (const day in weekTasksMap) {
// //             for (const hour in weekTasksMap[day]) {
// //                 const currTask = weekTasksMap[day][hour];
// //                 if (currTask === task) hoursCount++
// //             }
// //         }
//         acc[member.name] = hoursCount
//         return acc
//     }, {})
//     return Promise.resolve(memberHoursMap)
// }


// FOR FUTURE USAGE


// const teamMembers = [
//   // {
//   //   name: 'Hadas',
//   //   weekTasksMap: _createWeekTasksMap(),
//   //   tasks: ['Queue', 'Opening', 'Leads']
//   // },
//   // {
//   //   name: 'Guy',
//   //   weekTasksMap: _createWeekTasksMap(),
//   //   tasks: ['Queue', 'Opening', 'Leads']
//   // },
//   // {
//   //   name: 'Roi',
//   //   weekTasksMap: _createWeekTasksMap(),
//   //   tasks: ['Queue', 'Opening', 'MisterBit']
//   // },
//   // {
//   //   name: 'Shachar',
//   //   weekTasksMap: _createWeekTasksMap(),
//   //   tasks: ['Queue', 'Opening', 'MisterBit']
//   // },
//   {
//     name: 'Sharon',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//   },
//   {
//     name: 'Or',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//   },
//   {
//     name: 'Tom',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//   },
//   {
//     name: 'Omri',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//   },
//   {
//     name: 'Dafna',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//   },
//   {
//     name: 'Avior',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//   },
//   {
//     name: 'Oded',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'Leads', 'MisterBit']
//   },
//   {
//     name: 'Ido',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening', 'MisterBit']
//   },
//   // {
//   //   name: 'Matan',
//   //   weekTasksMap: _createWeekTasksMap(),
//   //   tasks: ['Queue', 'Opening']
//   // },
//   {
//     name: 'Lasry',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening']
//   },
//   {
//     name: 'Adina',
//     weekTasksMap: _createWeekTasksMap(),
//     tasks: ['Queue', 'Opening']
//   }
// ];

// // INITIAL STORE THE DATA
// (function addMembers() {
//   teamMembers.forEach(member => {
//     try {
//       collection.add(member)
//     } catch (err) {
//       console.log('error while adding task', err);
//       throw new Error()
//     }
//   })
// })()