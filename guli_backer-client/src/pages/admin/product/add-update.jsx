import React,{Component} from 'react'
import {Card, Icon, Form, Input, Button, Cascader, message} from "antd";
import {PAGE_SIZE} from "../../../config/constants/constants";
import LinkButton from "../../../components/LinkButton/LinkButton";
import {reqCategorys, reqProductAddOrUpdate} from "../../../api";
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'
const Item = Form.Item
const TextArea = Input.TextArea

class AddUpdate extends Component{

  state = {
    options:[]
  }

  constructor(props){
    super(props)
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  loadData = async (selectedOptions) => {
    //取选中的项的最后一个
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.lengyh > 0){
      const cOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      targetOption.children = cOptions
    }else {
      targetOption.isLeaf = true
    }
    //状态改变的部分会直接更新
    this.setState({
      options:[...this.state.options]
    })
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if(result.status === 0){
      const categorys = result.data
      if(parentId === '0'){
        this.initOptions(categorys) //一级分类则直接初始化
      }else {
        return categorys //二级分类 则直接返回Promise对象
      }
    }
  }
  initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))
    const {product, isUpdate} = this
    //更新 是二级分类
    if(isUpdate && product.pCategoryId !== '0'){
      const subCategorys = await this.getCategorys(product.pCategoryId)
      if (subCategorys && subCategorys.length > 0){
        const cOptions = subCategorys.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: true
        }))
        const targetOption = options.find(opt => opt.value===product.pCategoryId)
        targetOption.children = cOptions
      }
    }

    this.setState({options})
  }

  validatePrice = (rule, value, callBack) => {
    value = value * 1
    if(value > 0){
      callBack()
    }else {
      callBack('price > 0 is neccessary')
    }
  }

  submit = () => {
    this.props.form.validateFields(async (error, value) => {
      if(!error){
        const {name, price, desc, categoryIds} = value
        console.log(this.pw)
        console.log(this.pw.current)
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        let pCategoryId = ''
        let categoryId = ''
        if (categoryIds.length === 1){
          pCategoryId = '0'
          categoryId = categoryIds[0]
        }else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }

        const product = {name, price, desc, categoryId, pCategoryId, imgs, detail}
        if(this.isUpdate){
          product._id = this.product._id
        }

        const result = await reqProductAddOrUpdate(product)
        if(result.status === 0){
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        }else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
      }
    })
  }

  componentWillMount() {
    const product = this.props.location.state
    this.product = product || {}
    this.isUpdate = !!product
  }
  componentDidMount() {
    this.getCategorys('0')
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {isUpdate, product} = this
    const {pCategoryId, categoryId} = product
    const {options} = this.state

    const categoryIds = []
    if (isUpdate){
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left'></Icon>
        </LinkButton>
        &nbsp; &nbsp;
        <span>添加商品</span>
      </span>
    )

    const formItemLayout = {
      labelCol: { span: 2 },  // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name',{
                initialValue:product.name,
                rules:[
                  {required:true,message:'must hava name'}
                ]
              })(
                <Input placeholder='please input product name'/>
              )
            }
          </Item>
          <Item label='商品描述：'>
            {
              getFieldDecorator('desc',{
                initialValue:product.desc,
                rules:[
                  {required:true,message:'must hava desc'}
                ]
              })(
                <TextArea placeholder='please input product desc' autoSize/>
              )
            }
          </Item>
          <Item label='商品价格：'>
            {
              getFieldDecorator('price',{
                initialValue:product.price,
                rules:[
                  {required:true,message:'must hava price'}
                ]
              })(
                <Input placeholder='please input product price' addonAfter='元'/>
              )
            }
          </Item>
          <Item label='商品分类：'>
            {
              getFieldDecorator('categoryIds',{
                initialValue:categoryIds,
                rules:[
                  {required:true,message:'must hava categoryIds'}
                ]
              })(
                <Cascader
                  options={options}
                  loadData={this.loadData}
                ></Cascader>
              )
            }
          </Item>
          <Item label='商品图片：'>
            <PictureWall ref={this.pw} imgs={product.imgs}></PictureWall>
          </Item>
          <Item label='商品详情：' labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editor} detail={product.detail}></RichTextEditor>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(AddUpdate)
