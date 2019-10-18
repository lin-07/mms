import router from './router';
import store from '@/store'

router.beforeEach((to, from, next) => {
    // const token = localStorage.getItem('mxg-token');
    const token = store.state.user.token
    console.log('token',token)
    if(!token){
        // next({path:'/login'})
        if(to.path !== '/login'){
            next({path:'/login'})
        }else{
            next()
        }
    }else{
        // const user = localStorage.getItem('mxg-user');
        const user = store.state.user.user
        if(user){
            next()
        }else{
            store.dispatch('GetUserInfo').then(res => {
                if(res.status === '0'){
                    next()
                }else{
                    next({path:'/login'})
                }
            })
            // api.getUserInfo({'token':token}).then(res => {
            //     if(res.status === '0'){
            //         localStorage.setItem('mxg-user',JSON.stringify(res.data));
            //     }else{
            //         next({path:'/login'})
            //     }
            // })
        }
    }
})