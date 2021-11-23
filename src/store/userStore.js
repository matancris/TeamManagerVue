import { userService } from '../services/userServiceFirebase'

export const userStore = {
    state: {
        loggedinUser: null,
        adminRequests: []
    },
    mutations: {
        setLoggedinUser(state, { loggedinUser }) {
            state.loggedinUser = loggedinUser
        },
        setRequests(state, { requests }) {
            state.adminRequests = requests
        },
        removeRequest(state, { memberId }) {
            state.adminRequests = state.adminRequests.filter(req => req.member._id !== memberId)
        }
    },
    getters: {
        loggedinUser(state) {
            return state.loggedinUser

        },
        adminRequests(state) {
            return state.loggedinUser.isAdmin &&
                state.adminRequests
        }
    },
    actions: {
        async setLoggedinUser({ commit }, { user }) {
            await userService.login(user)
            const loggedinUser = userService.getUser()
            commit({ type: 'setLoggedinUser', loggedinUser });
        },
        loadLoggedinUser({ commit }) {
            const loggedinUser = userService.getUser()
            commit({ type: 'setLoggedinUser', loggedinUser });
        },
        logout({ commit }) {
            userService.logout()
            commit({ type: 'setLoggedinUser', loggedinUser: null });
        },
        async addReqToAdmin({ commit }, { memberReq }) {
            const requests = await userService.addReqToAdmin(memberReq)
            console.log('addReqToAdmin ~ requests', requests)
            commit({ type: 'setRequests', requests })
        },
        clearReqToAdmin({ commit }, { memberId }) {
            userService.clearReqToAdmin(memberId)
            commit({ type: 'removeRequest', memberId })
        }
    }
}