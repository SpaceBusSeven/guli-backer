import React,{Component} from 'react'
import {Switch, Route, Redirect} from "react-router-dom";

import Home from './home'
import AddUpdate from './add-update'
import Detail from './detail'
export default class ProductHome extends Component{

  render() {

    return (
      <Switch>
        <Route path='/product' component={Home} exact></Route>
        <Route path='/product/addUpdate' component={AddUpdate}></Route>
        <Route path='/product/detail' component={Detail}></Route>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
}
