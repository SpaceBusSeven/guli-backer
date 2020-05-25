import React,{Component} from 'react'
import {Card, List, Icon} from "antd";
import {reqCategoryInfo} from "../../../api";
import LinkButton from '../../../components/LinkButton/LinkButton'
import {BASE_IMG_PATH} from "../../../config/constants/constants";
import './index.less'

const Item = List.Item

export default class Detail extends Component{

  state = {
    cName1:'',
    cName2:''
  }

  getCategoryName = async () => {
    const {categoryId,pCategoryId} = this.props.location.state

    if(pCategoryId === '0'){
      const result = await reqCategoryInfo(categoryId)
      if(result.status === 0){
        const cName1 = result.data.name
        this.setState({cName1})
      }
    }else{
      const result = await Promise.all([reqCategoryInfo(pCategoryId), reqCategoryInfo(categoryId)])
      const cName1 = result[0].data.name
      const cName2 = result[1].data.name
      this.setState({cName1, cName2})
    }
  }

  componentDidMount() {
    this.getCategoryName()
  }

  render() {

    const {name, price, desc, detail, imgs} = this.props.location.state
    const {cName1, cName2} = this.state
    console.log(cName1, cName2)
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left'></Icon>
        </LinkButton>
        &nbsp; &nbsp;
        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格:</span>
            <span>{price + '元'}</span>
          </Item>
          <Item>
            <span className='left'>所属分类:</span>
            <span>{cName1 + (cName2?' --> '+cName2:null)}</span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img src={BASE_IMG_PATH+img} alt='img' key={img} className='product-img'/>
                ))
              }
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
