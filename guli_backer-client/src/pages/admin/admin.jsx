import React,{Component} from 'react'
import {Redirect, Switch, Route} from 'react-router-dom'
import storageUtils from '../../utils/storageUtils'
import { Layout } from 'antd';
import Header from '../../components/Header/Header'
import LeftNav from '../../components/LeftNav/LeftNav'
import Category from './category/category'
import ProductHome from './product/product'
import Role from './role/role'
import User from './user/user'
import Home from './home/home'
import Pie from './charts/pie/pie'
import Bar from './charts/bar/bar'
import Line from './charts/line/line'

import './admin.less'

const {Footer, Sider, Content } = Layout;

export default class Admin extends Component{
  render() {

    const user = storageUtils.getUser()
    if(!user._id){
      return <Redirect to='/login'></Redirect>
    }

    return (
      <Layout className="admin">
        <Sider className="admin-sider">
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <Header></Header>
          <Content className="admin-content">
            <Switch>
              <Route path='/category' component={Category}></Route>
              <Route path='/user' component={User}></Route>
              <Route path='/home' component={Home}></Route>
              <Route path='/role' component={Role}></Route>
              <Route path='/product' component={ProductHome}></Route>
              <Route path='/charts/pie' component={Pie}></Route>
              <Route path='/charts/bar' component={Bar}></Route>
              <Route path='/charts/line' component={Line}></Route>
              <Redirect to='/home'></Redirect>
            </Switch>
          </Content>
          <Footer className='admin-footer'>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
