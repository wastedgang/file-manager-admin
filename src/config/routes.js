import { AdminLayout } from '@/components'
import {
    NotFound,
    MySpace,
    Login,
    UserList,
    DatabaseSetting,
    StoreSpaceList,
    GroupList,
    PublicSpace,
    InitializeSetting
} from '@/views'
import { HomeOutlined, UserOutlined, SettingOutlined, ContainerOutlined, DatabaseOutlined, TeamOutlined, GlobalOutlined } from '@ant-design/icons'


const routes = [{
    path: '/login',
    component: Login
},{
    path: '/initialize',
    component: InitializeSetting
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
            icon: HomeOutlined,
            roles: ['SYSTEM_ADMIN', 'NORMAL'],
        },
    }, {
        path: '/admin/public-space',
        component: PublicSpace,
        title: '公共空间',
        menu: {
            icon: GlobalOutlined
        },
    }, {
        path: '/admin/groups',
        component: GroupList,
        title: '群组管理',
        menu: {
            icon: TeamOutlined,
            roles: ['SYSTEM_ADMIN', 'NORMAL'],
        },
    }, {
        path: '/admin/users',
        component: UserList,
        title: '用户管理',
        menu: {
            icon: UserOutlined,
            roles: ['SYSTEM_ADMIN'],
        },
    }, {
        path: '/admin/settings',
        title: '系统设置',
        menu: {
            icon: SettingOutlined,
            roles: ['SYSTEM_ADMIN'],
        },
        redirect: '/admin/settings/store-spaces',
        children: [{
            path: '/admin/settings/store-spaces',
            component: StoreSpaceList,
            title: '存储空间管理',
            menu: {
                icon: ContainerOutlined,
                roles: ['SYSTEM_ADMIN'],
            },
        }, {
            path: '/admin/settings/database',
            component: DatabaseSetting,
            title: '数据库信息',
            menu: {
                icon: DatabaseOutlined,
                roles: ['SYSTEM_ADMIN'],
            },
        }]
    }]
}]

export default routes