import {
    NotFound,
    MySpace,
    Login,
    SystemSettings,
    UserList
} from '@/views'

import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'

export const mainRoutes = [{
    path: '/login',
    component: Login
}, {
    path: '/404',
    component: NotFound
}]

export const adminRoutes = [{
    path: '/admin/my-space',
    component: MySpace,
    title: '我的空间',
    isNav: true,
    icon: HomeOutlined
}, {
    path: '/admin/users',
    component: UserList,
    title: '用户管理',
    isNav: true,
    icon: UserOutlined
}, {
    path: '/admin/system-settings',
    component: SystemSettings,
    title: '系统设置',
    isNav: true,
    icon: SettingOutlined
}]