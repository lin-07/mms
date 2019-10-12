import request from '@/utils/request'

export default {
    userLogin:(body) => request('/user/login',body,'post'),
    // 单个会员get请求无效为什么？
    getUserInfo:(body) => request('/user/getUserInfo',body,'post'),
    logout:(body) => request('/user/logout',body,'post'),

    memberList:(body) => request('/member/list',body,'post'),
    searchMemberList:(body) => request('/member/list/search',body,'post'),
    addMember:(body) => request('/member/add',body,'post'),
    getMemberById:(body) => request('/member/getMemberById',body,'post'),
    updateMember:(body) => request('/member/update',body,'post'),
    depeteMemberById:(body) => request('/member/deleteById',body,'post'),

    searchSupplierList:(body) => request('/supplier/list/search',body,'post'),
    addSupplier:(body) => request('/supplier/add',body,'post'),
    getSupplierById:(body) => request('/supplier/getSupplierById',body,'post'),
    updateSupplier:(body) => request('/supplier/update',body,'post'),
    depeteSupplierById:(body) => request('/supplier/deleteById',body,'post')
}