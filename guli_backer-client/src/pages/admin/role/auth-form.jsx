import React,{Component, PureComponent} from 'react'
import {Form, Input, Tree} from "antd";
import PropTypes from 'prop-types'
import menuList from '../../../config/menuConfig/menuConfig'

const Item = Form.Item
const TreeNode = Tree.TreeNode

export default class AuthForm extends PureComponent{

  static propTypes = {
    role: PropTypes.object
  }

  constructor(props){
    super(props)

    const {menus} = this.props.role
    this.state = {checkedKeys:menus}
  }

  getMenus = () => this.state.checkedKeys
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children? this.getTreeNodes(item.children):null}
        </TreeNode>
      )
      return pre
    },[])
  }
  onChecked = (checkedKeys) => {
    this.setState({checkedKeys})
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKey:menus
    })
  }

  render() {
    const {role} = this.props
    const {checkedKeys} = this.state

    return (
      <Form>
        <Item label='角色名称：' labelCol={{span:5}} wrapperCol={{span:16}}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onChecked}
        >
          <TreeNode title='平台权限' key='all'>
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}

