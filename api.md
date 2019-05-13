## 1.商品编辑

### 1.1 商品保存编辑

#### 接口地址

    goods_save.php

#### 输入 POST

```js
    {
        save_goods: 1,

        goods_id: "",    //sring 商品id (编辑时候会传)

        goods_type: 1,    //int 商品种类 (1:手机壳-DIY, 2:手机壳-标品, 3:礼品)

        goods_name: '',       //string 商品名称
        goods_material: '',   //string 材质 (商品类型是礼品的时候 不会传)
        phone_brand: '',      //string 品牌 (商品类型是礼品的时候 不会传)
        phone_model: '',      //string 型号
        price: '',            //float 单价
        remark: '',           //string 备注
        goods_stock: 1,       //int 商品库存

        pic_height: 1,            //int 图像高 (商品类型是DIY的时候会传)
        pic_width: 1,             //int 图像宽 (商品类型是DIY的时候会传)
        pic_radius: '',           // 四角弧度  (商品类型是DIY的时候会传)
        pic_position: 1,          //int 定位角  (1:'左上',2:'左下',3:'右上',4:'右下')  (商品类型是DIY的时候会传)
        horizontal_distance: 1,   //int 与横边距离  (商品类型是DIY的时候会传)
        vertical_distance: 1,     //int 与纵边距离  (商品类型是DIY的时候会传)


        base_pic_list: [           // Array<Object> (商品类型是礼品的时候 不会传)
            {
              color: '',          //string 颜色
              stock: 1,           //int 库存
              picture: ''         //string 图片名称
            }
        ]
    }
```

#### 输出

```js
    {
        "ret": 0,
        "msg": null,
        "data": {}
    }
```

### 1.2 商品列表

#### 接口地址

    goods_get.php

#### 输入 POST

```js
    {
        get_goods_list: 1,

        page_no:1,     //分页页数

        //下面是搜索项
        goods_material: '',   // 材质
        goods_type: '',       // 商品种类
        phone_brand: '',      // 品牌
        phone_model: '',      // 型号
        goods_name: '',       // 商品名称
        goods_id: '',         // 商品编号
        goods_stock_type: '', // 库存类型   （1.大于等于：more 2.小于等于：less）
        goods_stock: ''       // 商品库存
    }
```

#### 输出

```js
    {
        "ret": 0,
        "msg": null,
        "data": {
            goods_list: [],
            total: 100         //总数
        }
    }
```