import {RouterMount,createRouter} from 'uni-simple-router';
import store from '@/store/index.js'

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routerErrorEach:({type,msg})=>{
		console.log({type,msg})
		// #ifdef APP-PLUS
			if(type===3){
				router.$lockStatus=false;
				runtimeQuit();
			}
		// #endif
	},
	routes: [
		...ROUTES,
		{
		  path: '*',
		  redirect:(to)=>{
			  return {path: "/pages/404/404"}
		  }
		}
	]
});

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (uni.getStorageSync('hasLogin')) {
			next();
        }
        else {
            next({
				path: '/pages/personalHome/login/login',
                query: {redirect: to.fullPath},  // 将跳转的路由path作为参数，登录成功后跳转到该路由
				NAVTYPE: 'push'
			})
        }
    }
    else {
        next();
    }
})
// 全局路由后置守卫
router.afterEach((to, from) => {
    // console.log('跳转结束');
})

export {
	router,
	RouterMount
}