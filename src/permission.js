import router from './router';
import api from './api'

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('mxg-token');
    if(!token){
        // next({path:'/login'})
        if(to.path !== '/login'){
            next({path:'/login'})
        }else{
            next()
        }
    }else{
        const user = localStorage.getItem('mxg-user');
        if(user){
            next()
        }else{
            api.getUserInfo({'token':token}).then(res => {
                if(res.status === '0'){
                    localStorage.setItem('mxg-user',JSON.stringify(res.data));
                }else{
                    next({path:'/login'})
                }
            })
        }
    }
})