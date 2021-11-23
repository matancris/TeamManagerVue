import { teamService } from '../services/teamServiceFirebase'

export const memberStore = {
    state: {
        members: []
    },
    mutations: {
        setMembers(state, { members }) {
            state.members = members
        },
        updateMember(state, payload) {
            const idx = state.members.findIndex(member => member._id === payload.member._id)
            state.members.splice(idx, 1, payload.member)
        },
        removeMember(state, { memberId }) {
            const idx = state.members.findIndex(member => member._id === memberId)
            state.members.splice(idx, 1)
        },
        addMember(state, { memberToAdd }) {
            state.members.push(memberToAdd)
        },
    },
    getters: {
        members(state) {
            return state.members
        },
        taskNumMap(state) {
            const taskNumMap = state.members.reduce((acc, member) => {
                const { weekTasksMap } = member;
                for (const day in weekTasksMap) {
                    if (!acc[day]) acc[day] = {};
                    for (const hour in weekTasksMap[day]) {
                        const task = weekTasksMap[day][hour];
                        if (!acc[day][hour]) acc[day][hour] = {};
                        if (!acc[day][hour][task]) acc[day][hour][task] = { members: [] };

                        acc[day][hour][task].count++;
                        acc[day][hour][task].members.push(member.name);
                    }
                }
                return acc;
            }, {});
            return taskNumMap;
        },
        memberHoursMap: (state) => (task) => {
            const memberFreeHoursMap = state.members.reduce((acc, member) => {
                let hoursCount = 0;
                const { weekTasksMap } = member;
                for (const day in weekTasksMap) {
                    for (const hour in weekTasksMap[day]) {
                        const currTask = weekTasksMap[day][hour];
                        if (currTask === task) hoursCount++
                    }
                }
                acc[member.name] = hoursCount
                return acc
            }, {})
            return memberFreeHoursMap
        }

    },
    actions: {
        async loadMembers({ commit }) {
            const members = await teamService.query()
            commit({ type: 'setMembers', members })
        },
        async updateCalender({ commit }, { data }) {
            const members = await teamService.updateCalender(data);
            commit({ type: 'setMembers', members })
        },
        async updateMember({ commit }, payload) {
            await teamService.updateMember(payload.member)
            commit(payload)
        },
        async addMember({ commit }, { memberName }) {
            const memberToAdd = await teamService.addMember(memberName)
            commit({ type: 'addMember', memberToAdd })
        },
        async removeMember({ commit }, payload) {
            await teamService.removeMember(payload.memberId)
            commit(payload)
        },
        async generateMembersCalenders({ commit }) {
            const members = await teamService.generateCalenders()
            commit({ type: 'setMembers', members })
        },
        async mergeMemberCal(context, { memberReq }) {
            const updatedMember = await teamService.mergeMemberCal(memberReq)
            context.dispatch({ type: 'clearReqToAdmin', memberId: memberReq.member._id })
            console.log('mergeMemberCal ~ updatedMember', updatedMember)
            context.commit({ type: 'updateMember', member: updatedMember })
        }
    }
}