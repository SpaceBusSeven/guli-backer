import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from "antd";
import LinkButton from '../LinkButton/LinkButton'
import {reqWeather} from "../../api";
import {formatDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig/menuConfig'
import './header.less'

class Header extends Component{

  state = {
    sysTime: formatDate(Date.now()),
    dayPictureUrl:'',
    weather:'',
  }

  getSysTime =  () => {
    this.headerTimer = setInterval(() => {
      this.setState({
        sysTime: formatDate(Date.now())
      })
    }, 1000)
  }
   getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('岳阳')
     this.setState({dayPictureUrl, weather})
  }
  getTitle = (menuList, path) => {
    menuList.forEach(item => {
      if(path.indexOf(item.key) === 0){
        this.title = item.title
      }else if(item.children) {
        item.children.forEach(child => {
          if(path.indexOf(child.key) === 0){
            this.title = child.title
          }
        })
      }
    })
  }

  logout = () => {
    Modal.confirm({
      content:'really logout?',
      onOk: () => {
        console.log('logout')
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
      },
      onCancel: () => {
        console.log('cancel logout')
      }
    })
  }

  componentDidMount() {
    this.getSysTime()
    this.getWeather()
  }
  componentWillUnmount() {
    clearInterval(this.headerTimer)
  }

  render() {
    const path = this.props.location.pathname
    this.getTitle(menuList, path)

    const {sysTime, dayPictureUrl, weather} = this.state
    const {title} = this
    return (
      <div className="header">
        <div className='header-top'>
          <span className='header-top-user'>欢迎, admin</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {title}
          </div>
          <div className='header-bottom-right'>
            <span>{sysTime}</span>
            <img src={dayPictureUrl} alt="dayPicture"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
