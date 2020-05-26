import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { adminRoutes } from '@/config'

import { AdminLayout } from '@/components'

export default class App extends Component {
    render() {
        return (
            <AdminLayout>
                <Switch>
                    {
                        adminRoutes.map(route => {
                            return <Route key={route.path} path={route.path} render={(props) => {
                                return <route.component {...props} />
                            }} />
                        })
                    }
                </Switch>
            </AdminLayout>
        )
    }
}
