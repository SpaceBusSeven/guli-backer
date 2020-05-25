import React,{Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd';
import {reqCategorys,reqAddCategory,reqUpdateCategory} from "../../../api";
import LinkButton from '../../../components/LinkButton/LinkButton'
import UpdateForm from './update-form'
import AddForm from './add-form'
import {PAGE_SIZE} from "../../../config/constants/constants";

export default class Category extends Component{

  state = {
   categorys:[],
   subCategorys:[],
   parentId:'0',
   parentName:'',
   loading:false,
   showTalk:0
  }

  getCategorys = async (parentId) => {
    this.setState({loading:true})

    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)

    this.setState({loading:false})
    if(result.status === 0){
      const categorys = result.data
      if(parentId === '0'){
        this.setState({categorys})
      }else{
        this.setState({subCategorys:categorys})
      }
    }else{
      message.error(result.msg)
    }
  }

  showSubCategorys = (category) => {
    this.setState({
      parentId:category._id,
      parentName:category.name
    }, () => { this.getCategorys() })
  }
  showCategorys = () => {
    this.setState({
      subCategorys:[],
      parentId:'0',
      parentName:'',
      showTalk:0
    })
  }
  showAdd = () => {
    this.setState({showTalk:1})
  }
  showUpdate = (category) => {
    this.category = category
    this.setState({showTalk:2})
  }

  addCategory =async () => {
    const {parentId, categoryName} = this.form.getFieldsValue()
    this.setState({showTalk:false})
    this.form.resetFields()

    const result = await reqAddCategory(parentId, categoryName)
    if(result.status === 0){
      if(parentId === this.state.parentId){
        this.getCategorys()
      }else if(parentId === '0'){
        this.getCategorys(parentId)
      }
    }else{
      message(result.msg)
    }
  }
  updateCategory =async () => {
    const {categoryName} = this.form.getFieldsValue()
    const categoryId = this.category._id

    this.setState({showTalk:false})
    this.form.resetFields()

    const result = await reqUpdateCategory(categoryId, categoryName)
    console.log(result)
    if(result.status === 0){
      this.getCategorys()
    }
  }

  componentWillMount() {
    this.columns = [
      {
        title:'分类名称',
        dataIndex:'name'
      },
      {
        title:'操作',
        width:300,
        render: category => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            &nbsp;&nbsp;&nbsp;
            {
              this.state.parentId === '0'?
              <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
          </span>
        )
      }
    ]
  }
  componentDidMount() {
    this.getCategorys()
  }

  render() {
    const {categorys, subCategorys, parentId, parentName, loading, showTalk} = this.state

    const category = this.category || {}
    const title = parentId === '0' ? '一级分类列表':(
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>&nbsp;&nbsp;
        <Icon type='arrow-right'/>&nbsp;&nbsp;
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus" />添加分类
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={parentId === '0' ? categorys:subCategorys}
          pagination={{ pageSize: PAGE_SIZE, showQuickJumper:true}}
          loading={loading}
        />
        <Modal
          title='添加分类'
          visible={showTalk == 1}
          onOk={this.addCategory}
          onCancel={() => {this.setState({showTalk:0})}}
        >
          <AddForm setForm={form => this.form = form} categorys={categorys} parentId={parentId}></AddForm>
        </Modal>
        <Modal
          title='修改分类'
          visible={showTalk == 2}
          onOk={this.updateCategory}
          onCancel={() => {this.setState({showTalk:0})}}
        >
          <UpdateForm categoryName={category.name} setForm={form => this.form = form}></UpdateForm>
        </Modal>
      </Card>
    )
  }
}
