import React,{Component} from 'react'
import {Card, Table, Modal, Icon, message, Select, Input, Button} from "antd";
import LinkButton from '../../../components/LinkButton/LinkButton'
import {PAGE_SIZE} from '../../../config/constants/constants'
import {reqSearchProduct, reqProductList, reqUpdateProductStatus} from "../../../api";
import product from "./product";

const Option = Select.Option

export default class Home extends Component{

  state = {
    searchType:'productName',
    searchName:'',
    total:0,
    products:[]
  }

  initColumn = () => {
    this.column = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price) => <span>￥{price}</span>
      },
      {
        title: '状态',
        width:100,
        render:(product) => {
          let status = product.status
          const btnText = status === 1?'下架':'上架'
          const text = status === 1?'在售':'已下架'
          status = status === 1? 2 : 1
          return (
            <span>
              <Button type='primary'
                      onClick={() => this.updateProductStatus(product._id, status)}
              >
                {btnText}
              </Button>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width:100,
        render: (product) => (
          <span>
            <LinkButton onClick={() => this.props.history.push('/product/detail',product)}>详情</LinkButton>
            <LinkButton  onClick={() => this.props.history.push('/product/addUpdate',product)}>修改</LinkButton>
          </span>
        )
      },
    ]
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    const {searchType, searchName} = this.state
    let result
    if(searchName){
      result = await reqSearchProduct({pageNum, pageSize:PAGE_SIZE, searchType, searchName})
    }else{
      result = await reqProductList(pageNum, PAGE_SIZE)
    }
    if (result.status === 0){
      const {total, list} = result.data
      this.setState({
        total, products:list
      })
    }else {
      message.error('get data error:'+result.msg)
    }
  }

  updateProductStatus = async (productId, status) => {
    const result = await reqUpdateProductStatus(productId, status)
    if(result.status === 0){
      message.success('status update success')
      this.getProducts(this.pageNum || 1)
    }else{
      message.error('status update failed')
    }
  }
  componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getProducts(1)
  }


  render() {

    const {searchType, total, products} = this.state

    const title = (
      <span>
        <Select value={searchType}
                onChange={value => this.setState({searchType:value})}
                style={{width:130}}
        >
          <Option key='productName' value='productName'>按名称搜索</Option>
          <Option key='productDesc' value='productDesc'>按描述搜索</Option>
        </Select>&nbsp;&nbsp;&nbsp;
        <Input placeholder='关键字'
               style={{width:150, marginLeft:10, marginRight:10}}
               onChange={e => this.setState({searchName:e.target.value})}
        ></Input>&nbsp;&nbsp;&nbsp;
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addUpdate')}>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )
    return (
      <Card
        extra={extra}
        title={title}
      >
        <Table
          bordered
          rowKey='_id'

          dataSource={products}
          columns={this.column}
          pagination={{
            defaultPageSize:PAGE_SIZE,
            total,
            showQuickJumper:true,
            onChange:this.getProducts
          }}
        />
      </Card>
    )
  }
}
