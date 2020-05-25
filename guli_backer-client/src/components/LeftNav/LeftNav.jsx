import React,{Component} from 'react'
import { Menu, Icon } from 'antd';
import {Link, withRouter} from 'react-router-dom'
import Logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig/menuConfig'
import storageUtils from '../../utils/storageUtils'
import './LeftNav.less'

const { SubMenu } = Menu;

class LeftNav extends Component{

  hasAuth = (item) => {
    const key = item.key
    const menuSet = this.menuSet
    if (item.isPublic || storageUtils.getUser().username === 'admin' || menuSet.has(key)){
      return true
    }else if(item.children){
      return !!item.children.find(child => menuSet.has(child.key))
    }
  }

  getMenuNodes (menuList) {
    let path = this.props.location.pathname

    if(path.indexOf('/product') === 0){
      path ='/product'
    }

    return menuList.map(item => {
      if(this.hasAuth(item)){
        if(!item.children){
          return (
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        }else{
          if(item.children.find(child => path.indexOf(child.key) === 0)){
            this.openKey = item.key
            console.log(this.openKey)
          }
          return (
            <SubMenu key={item.key}
                     title={
                       <span>
                 <Icon type={item.icon}></Icon>
                 <span>{item.title}</span>
               </span>
                     }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }
    })
  }

  /*getMenuNodes2 (menuList){
    let path = this.props.location.pathname

    if(path.indexOf('/product') === 0){
      path ='/product'
    }

    return menuList.reduce((menuTotal,item) => {
      if(!item.children){
        menuTotal.push(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }else{
        if(item.children.find(child => path.indexOf(child.key) === 0)){
          this.openKey = item
        }
        menuTotal.push(
          <SubMenu key={item.key}
                   title={
                     <span>
                 <Icon type={item.icon}></Icon>
                 <span>{item.title}</span>
               </span>
                   }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
      return menuTotal
    },[])
  }*/
  componentWillMount() {
    console.log(storageUtils.getUser())
    this.menuSet = new Set(storageUtils.getUser().role.menus || [])
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    let selectKey = this.props.location.pathname
    if(selectKey.indexOf('/product')===0) { // 当前请求的是商品或其子路由界面
      selectKey = '/product'
    }
    const {openKey} = this

    return (
      <div className="left-nav">
        <Link to='/home' className="left-nav-header">
          <img src={Logo} alt="left-nav-logo" className='left-nav-logo'/>
          <span className='left-nav-text'>后台管理</span>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectKey]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)
