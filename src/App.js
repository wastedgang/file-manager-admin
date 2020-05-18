import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { adminRoutes } from '@/routes'

import { AdminLayout } from '@/components'

const menus = adminRoutes.filter(route => route.isNav === true)

export default class App extends Component {
    render() {
        return (
            <AdminLayout menus={menus}>
                <Switch>
                    {
                        adminRoutes.map(route => {
                            return <Route key={route.path} path={route.path} render={(props) => {
                                return <route.component {...props} />
                            }} />
                        })
                    }
                    <Redirect to="/admin/my-space" from="/admin" exact />
                    <Redirect to="/404" />
                </Switch>
            </AdminLayout>
        )
    }
}
