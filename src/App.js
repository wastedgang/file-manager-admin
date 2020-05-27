import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { routes } from '@/config'

const mapState = state => ({
    ...state.user
})
@connect(mapState)
class App extends Component {
    render() {
        return (
            <Switch>
                {
                    this.props.isLogin ? null : <Redirect to="/admin/public-space" from="/admin" exact />
                }
                {
                    routes.map((routeInfo) => {
                        return (
                            <Route path={routeInfo.path} key={routeInfo.path} render={(props) => {
                                // TODO: 权限，需要登录
                                return <routeInfo.component {...props} route={routeInfo} />
                            }}>
                            </Route>
                        )
                    })
                }
                <Redirect to="/admin" from="/" exact />
                <Redirect to="/404" />
            </Switch>
        )
    }
}

export default App
