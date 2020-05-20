import { AdminLayout } from '@/components'
import {
    NotFound,
    MySpace,
    Login,
    UserList,
    DatabaseSetting,
    StoreSpaceList,
} from '@/views'
import { HomeOutlined, UserOutlined, SettingOutlined, ContainerOutlined, DatabaseOutlined } from '@ant-design/icons'


const routes = [{
    path: '/login',
    component: Login
}, {
    path: '/404',
    component: NotFound
}, {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/my-space',
    children: [{
        path: '/admin/my-space',
        component: MySpace,
        title: '我的空间',
        menu: {
            icon: HomeOutlined
        },
    }, {
        path: '/admin/users',
        component: UserList,
        title: '用户管理',
        menu: {
            icon: UserOutlined
        },
    }, {
        path: '/admin/settings',
        title: '系统设置',
        menu: {
            icon: SettingOutlined
        },
        redirect: '/admin/settings/store-spaces',
        children: [{
            path: '/admin/settings/store-spaces',
            component: StoreSpaceList,
            title: '存储空间管理',
            menu: {
                icon: ContainerOutlined
            },
        }, {
            path: '/admin/settings/database',
            component: DatabaseSetting,
            title: '数据库信息',
            menu: {
                icon: DatabaseOutlined
            },
        }]
    }]
}]

export default routes