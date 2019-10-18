import api from '@/api'
import {getToken,setToken,getUser,setUser,remove} from '@/utils/auth'

const user = {
    state:{
        token:getToken(),
        user:getUser()
    },
    mutations:{
        SET_TOKEN(state,token){
            state.token = token
            setToken(token)
        },
        SET_USER(state,user){
            state.user = user
            setUser(user)
        }
    },
    actions:{
        Login({commit,state},form){
            return new Promise((resolve,reject) => {
                api.userLogin(form).then(res => {
                    console.log(res)
                    commit('SET_TOKEN',res.data.token)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetUserInfo({commit,state}){
            return new Promise((resolve,reject) => {
                api.getUserInfo(state.token).then(res => {
                    console.log(res)
                    commit('SET_USER',res.data)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        Logout({commit,state}){
            return new Promise((resolve,reject) => {
                api.logout(state.token).then(res => {
                    console.log(res)
                    commit('SET_TOKEN','')
                    commit('SET_USER',null)
                    remove()
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user