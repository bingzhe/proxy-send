<template>
  <div id="goods-edit-page" class="app-container">
    <div class="title-wrapper">
      <span class="title-text">{{ goods_id ? '编辑商品' : '添加新商品' }}</span>
      <el-button class="btn-bd-primary" @click="handlerGoBackClick"> 返回 </el-button>
    </div>
    <div class="baseinfo-form-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="基本信息" />
      </div>
      <el-form
        ref="baseinfoForm"
        :model="baseinfoForm"
        :rules="baseinfoFormRules"
        :validate-on-rule-change="false"
      >
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="商品名称" label-width="160px" prop="goods_name">
              <el-input
                v-model="baseinfoForm.goods_name"
                placeholder="请输入"
                @change="getSkuType"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="商品种类" label-width="160px" prop="type">
              <el-select
                v-model="baseinfoForm.type"
                placeholder="请选择"
                @change="handlerGoodsTypeChagne"
              >
                <el-option
                  v-for="item in goodsTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-if="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="材质"
              label-width="160px"
              prop="raw_material"
            >
              <el-select
                v-model="baseinfoForm.raw_material"
                placeholder="请选择"
                filterable
                @change="getSku"
              >
                <el-option
                  v-for="item in raw_material_list"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-if="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="品牌"
              label-width="160px"
              prop="brand"
            >
              <el-select
                v-model="baseinfoForm.brand"
                placeholder="请选择"
                filterable
                @change="handlerBrandChange"
              >
                <el-option
                  v-for="item in phone_brand_list"
                  :key="item.brand_id"
                  :label="item.brand_name"
                  :value="item.brand_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-if="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="型号"
              label-width="160px"
              prop="model"
            >
              <el-select
                v-model="baseinfoForm.model"
                placeholder="请选择"
                filterable
                @change="getSku"
              >
                <el-option
                  v-for="item in model_list"
                  :key="item.model_id"
                  :label="item.model_name"
                  :value="item.model_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="单价" label-width="160px" prop="price">
              <el-input
                v-model.trim="baseinfoForm.price"
                v-limit-input-number="baseinfoForm.price"
                data-dotrange="{0,2}"
                placeholder="请输入"
              >
                <!-- type="number" -->
                <span slot="suffix" class="input-suffix-text">元</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="goodsType === GOODS_TYPE.GIFT" :span="11" :xs="20">
            <el-form-item label="sku编码" label-width="160px" prop="sku">
              <el-tooltip effect="dark" :content="baseinfoForm.sku" placement="top">
                <el-input
                  v-model.trim="baseinfoForm.sku"
                  placeholder="请输入"
                  @change="getSkuGift"
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col v-if="goodsType === GOODS_TYPE.GIFT" :span="18" :xs="20">
            <el-form-item
              label="库存"
              label-width="160px"
              prop="warehouse_inventory"
              class="gift-warehouse-inventory"
            >
              <el-row
                v-for="(item, index) in baseinfoForm.warehouse_inventory"
                :key="index"
                class="gift-item"
              >
                <!-- :gutter="6" -->
                <el-col :span="9">
                  <el-form-item
                    class="gift-inventory-form-item"
                    :rules="{ required: true, message: '请选择仓库', trigger: 'change' }"
                    :prop="'warehouse_inventory.' + index + '.warehouse_id'"
                  >
                    <el-select
                      v-model="item.warehouse_id"
                      filterable
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="warehouse in warehouseList"
                        :key="warehouse.warehouse_id"
                        :label="warehouse.warehouse_name"
                        :value="warehouse.warehouse_id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item
                    class="gift-inventory-form-item"
                    :rules="[
                      { required: true, message: '请输入仓库库存', trigger: 'blur' },
                      { type: 'number', message: '仓库库存必须为数组' }
                    ]"
                    :prop="'warehouse_inventory.' + index + '.inventory'"
                  >
                    <el-input v-model.number="item.inventory" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button
                    v-if="index === 0"
                    type="primary"
                    @click="handleGiftWarehouseAddClick"
                  >新增仓库</el-button>
                  <el-button
                    v-if="index !== 0"
                    type="danger"
                    @click="handleGifeWarehousedelClick(index)"
                  >删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" label-width="160px">
              <el-input
                v-model="baseinfoForm.remark"
                :rows="5"
                type="textarea"
                placeholder="请输入"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 赠品 -->
    <div
      v-show="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
      class="attach-list-form-wrapper"
    >
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#7d33ff" text="赠品" />
      </div>
      <el-form :modle="attachListForm">
        <el-row>
          <el-col :span="22">
            <el-form-item label="礼品名称" label-width="160px">
              <el-input
                v-model="attachListForm.attach_list_str"
                :rows="3"
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-show="goodsType === GOODS_TYPE.DIY" class="printinfo-form-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="打印参数" />
      </div>

      <PrintParam ref="backPrintParam" picPosition="背面图" :hasPriceItem="false" />
      <PrintParam ref="leftPrintParam" picPosition="左面图" />
      <PrintParam ref="rightPrintParam" picPosition="右面图" />
      <PrintParam ref="topPrintParam" picPosition="上面图" />
      <PrintParam ref="bottomPrintParam" picPosition="下面图" />
    </div>

    <div
      v-show="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
      class="base-pic-wrapper"
    >
      <div class="base-pic-title-wrapper">
        <baseinfo-title color="#F3C148" text="底图颜色" />
        <div class="add-btn-wrapper" @click="handlerAddPicClick">
          <!-- <span class="add-btn-icon" /> -->
          <i class="el-icon-circle-plus" />
          <span class="add-btn-text">新增</span>
        </div>
      </div>
      <div class="base-pic-table-wrapper default-table-change">
        <el-form ref="basePicForm" :model="basePicForm">
          <el-table :data="basePicForm.opt_color_list" stripe border :default-expand-all="true">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="lrtb-upload-wrapper">
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="左侧底图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `底图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.left.color_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="7"
                      @on-success="
                        (res) => {
                          return handleLeftColorImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.left.color_img"
                        :src="scope.row.left.color_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="左侧轮廓图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `轮廓图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.left.outline_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="3"
                      @on-success="
                        (res) => {
                          return handleLeftOutlineImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.left.outline_img"
                        :src="scope.row.left.outline_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="右侧底图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `底图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.right.color_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="7"
                      @on-success="
                        (res) => {
                          return handleRightColorImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.right.color_img"
                        :src="scope.row.right.color_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="右侧轮廓图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `轮廓图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.right.outline_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="3"
                      @on-success="
                        (res) => {
                          return handleRightOutlineImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.right.outline_img"
                        :src="scope.row.right.outline_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="顶部底图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `底图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.top.color_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="7"
                      @on-success="
                        (res) => {
                          return handleTopColorImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.top.color_img"
                        :src="scope.row.top.color_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="顶部轮廓图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `轮廓图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.top.outline_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="3"
                      @on-success="
                        (res) => {
                          return handleTopOutlineImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.top.outline_img"
                        :src="scope.row.top.outline_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="底部底图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `底图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.bottom.color_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="7"
                      @on-success="
                        (res) => {
                          return handleBottomColorImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.bottom.color_img"
                        :src="scope.row.bottom.color_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                  <el-form-item
                    class="pictable-form-item lrtb-form-item"
                    label="底部轮廓图"
                    label-width="60px"
                  >
                    <!-- :rules="{
                      required: true,
                      message: `轮廓图不能为空`
                    }"
                    :prop="`opt_color_list.${scope.$index}.bottom.outline_img`" -->
                    <sl-upload
                      class="outline-uploader"
                      :type="3"
                      @on-success="
                        (res) => {
                          return handleBottomOutlineImgSuc(res, scope.row)
                        }
                      "
                    >
                      <img
                        v-if="scope.row.bottom.outline_img"
                        :src="scope.row.bottom.outline_img_url"
                        class="upload-preview"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </sl-upload>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="序号" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="color_name" label="颜色" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{
                    required: true,
                    message: '颜色不能为空',
                    trigger: 'blur'
                  }"
                  :prop="'opt_color_list.' + scope.$index + '.color_name'"
                >
                  <el-input v-model="scope.row.color_name" placeholder="请输入" @change="getSku" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="sku" label="sku编码" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{
                    required: true,
                    message: 'sku编码不能为空',
                    trigger: 'blur'
                  }"
                  :prop="'opt_color_list.' + scope.$index + '.sku'"
                >
                  <el-tooltip effect="dark" :content="scope.row.sku" placement="top">
                    <el-input v-model="scope.row.sku" placeholder="请输入" @change="getSku" />
                  </el-tooltip>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="warehouse_inventory" label="库存" min-width="240" align="center">
              <template slot-scope="scope">
                <div class="warehouse-addbtn-wrapper">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleAddWarehouseClick(scope.row)"
                  >新增仓库</el-button>
                </div>
                <el-row
                  v-for="(item, index) in scope.row.warehouse_inventory"
                  :key="index"
                  :gutter="6"
                >
                  <el-col :span="10">
                    <el-form-item
                      class="warehouse-form-item"
                      :rules="{ required: true, message: '请选择仓库', trigger: 'change' }"
                      :prop="
                        'opt_color_list.' +
                          scope.$index +
                          '.warehouse_inventory.' +
                          index +
                          '.warehouse_id'
                      "
                    >
                      <el-select
                        v-model="item.warehouse_id"
                        size="mini"
                        filterable
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="warehouse in warehouseList"
                          :key="warehouse.warehouse_id"
                          :label="warehouse.warehouse_name"
                          :value="warehouse.warehouse_id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item
                      class="warehouse-form-item"
                      :rules="[
                        { required: true, message: '请输入仓库库存', trigger: 'blur' },
                        { type: 'number', message: '仓库库存必须为数组' }
                      ]"
                      :prop="
                        'opt_color_list.' +
                          scope.$index +
                          '.warehouse_inventory.' +
                          index +
                          '.inventory'
                      "
                    >
                      <el-input v-model.number="item.inventory" size="mini" placeholder="请输入" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" class="warehouse-form-item">
                    <el-button
                      v-if="index !== 0"
                      type="danger"
                      size="mini"
                      @click="handleDelWarehouseClick(scope.row, index)"
                    >删除</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="inventory" label="库存" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{validator: checkInventory,trigger: 'blur'}"
                  :prop="'opt_color_list.' + scope.$index + '.inventory'"
                >
                  <el-input v-model.trim="scope.row.inventory" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>-->
            <el-table-column
              prop="color_img"
              :label="goodsType === GOODS_TYPE.DIY ? '底图' : '图片'"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{
                    required: true,
                    message: `${goodsType === GOODS_TYPE.DIY ? '底图' : '图片'}不能为空`
                  }"
                  :prop="'opt_color_list.' + scope.$index + '.color_img'"
                >
                  <sl-upload
                    class="outline-uploader"
                    :type="7"
                    @on-success="
                      (res) => {
                        return handlerOutlineImgSuccess(res, scope.row)
                      }
                    "
                  >
                    <img
                      v-if="scope.row.color_img"
                      :src="scope.row.color_img_url"
                      class="upload-preview"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </sl-upload>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="goodsType === GOODS_TYPE.DIY"
              prop="outline_img"
              label="轮廓图"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{ required: true, message: '轮廓图不能为空' }"
                  :prop="'opt_color_list.' + scope.$index + '.outline_img'"
                >
                  <sl-upload
                    class="outline-uploader"
                    :type="3"
                    @on-success="
                      (res) => {
                        return handlerOutlineImgSuc(res, scope.row)
                      }
                    "
                  >
                    <img
                      v-if="scope.row.outline_img"
                      :src="scope.row.outline_img_url"
                      class="upload-preview"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </sl-upload>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="opr" label="操作" min-width="45" align="center">
              <template slot-scope="scope">
                <el-button
                  class="text-btn"
                  type="text"
                  @click="handlerDeletePicClick(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>

    <div class="gray-border-bottom" />

    <div class="button-group-wrapper">
      <el-button class="btn-h-44-w-100 btn-bd-primary" @click="handlerGoBackClick">
        取消
      </el-button>
      <el-button class="btn-h-44-w-100" type="primary" @click="handlerSaveBtnClick">{{
        goods_id ? '保存' : '提交'
      }}</el-button>
    </div>
  </div>
</template>
<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { GOODS_TYPE, GOODS_PRINT_POSITION } from '@/config/cfg'
import { goodsSave, goodsGet, warehouseGet } from '@/api/api'
import { mapState } from 'vuex'
import SlUpload from '@/components/upload/index'
import PrintParam from './PrintParam'

export default {
  components: {
    BaseinfoTitle,
    SlUpload,
    PrintParam
  },
  data() {
    const checkInventory = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('库存不能为空'))
      }
      const reg = /^\d+$/

      if (!reg.test(value)) {
        callback(new Error('库存只能为数字'))
      } else {
        callback()
      }
    }
    return {
      token: window.Store.GetGlobalData('token'),

      goods_id: '',
      goodsType: 1,

      baseinfoForm: {
        goods_name: '', // 商品名称
        type: '', // 商品种类
        raw_material: '', // 材质
        brand: '', // 品牌
        model: '', // 型号
        price: '', // 单价
        remark: '', // 备注
        inventory: '', // 商品库存  礼品
        sku: '', // sku  礼品
        warehouse_inventory: [{ warehouse_id: '', inventory: '' }] // 礼品的商品库存
      },
      // 赠送的礼品
      attachListForm: {
        attach_list_str: ''
      },

      // opt_color_list 模板
      // color_name: '',
      // inventory: '',
      // color_img: '',
      // outline_img: '',
      // sku: '',
      // left: { color_img: '', outline_img: '' },
      // right: { color_img: '', outline_img: '' },
      // top: { color_img: '', outline_img: '' },
      // bottom: { color_img: '', outline_img: '' },
      // warehouse_inventory: [{ warehouse_id: '', inventory: '' }]
      basePicForm: {
        opt_color_list: []
      },

      baseinfoFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择商品种类', trigger: 'change' }],
        raw_material: [{ required: true, message: '请选择材质', trigger: 'change' }],
        brand: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        model: [{ required: true, message: '请选择型号', trigger: 'change' }],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        inventory: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
        sku: [{ required: true, message: '请输入商品sku编码', trigger: 'blur' }],
        warehouse_inventory: [{ required: true, type: 'array' }]
      },

      GOODS_TYPE,
      model_list: [], // 手机型号 list

      // 商品种类
      goodsTypeOptions: [
        {
          value: GOODS_TYPE.DIY,
          label: GOODS_TYPE.toString(GOODS_TYPE.DIY)
        },
        {
          value: GOODS_TYPE.NORM,
          label: GOODS_TYPE.toString(GOODS_TYPE.NORM)
        },
        {
          value: GOODS_TYPE.GIFT,
          label: GOODS_TYPE.toString(GOODS_TYPE.GIFT)
        }
      ],

      checkInventory,

      warehouseList: [] // 库存选择仓库列表
    }
  },
  computed: {
    ...mapState({
      phone_brand_list: (state) => state.user.phone_brand_list,
      raw_material_list: (state) => state.user.raw_material_list
    })
  },
  created() {
    if (this.$route.query.goodsid) {
      this.goods_id = this.$route.query.goodsid
      this.getGoodsInfo()
    }
    this.getWarehouseList()
  },
  methods: {
    handlerAddPicClick() {
      this.basePicForm.opt_color_list.push({
        color_name: '',
        inventory: '',
        color_img: '',
        outline_img: '',
        sku: '',
        left: { color_img: '', outline_img: '' },
        right: { color_img: '', outline_img: '' },
        top: { color_img: '', outline_img: '' },
        bottom: { color_img: '', outline_img: '' },
        warehouse_inventory: [{ warehouse_id: '', inventory: '' }]
      })
    },
    handlerDeletePicClick(item) {
      const index = this.basePicForm.opt_color_list.indexOf(item)
      if (index !== -1) {
        this.basePicForm.opt_color_list.splice(index, 1)
      }
    },
    handlerGoBackClick() {
      this.$router.go(-1)
    },
    handlerGoodsTypeChagne(val) {
      this.goodsType = val
      this.getSkuType()
    },
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          resolve(valid)
        })
      })
    },

    async getGoodsInfo() {
      const data = {
        opr: 'get_goods_info',
        goods_id: this.goods_id
      }

      const resp = await goodsGet(data)
      console.log('商品信息 res=>', resp)

      if (resp.ret !== 0) return

      const info = resp.data.info

      this.goodsType = info.type

      this.baseinfoForm.goods_name = info.goods_name
      this.baseinfoForm.type = info.type
      this.baseinfoForm.raw_material = info.raw_material || ''
      this.baseinfoForm.brand = info.brand || ''
      // this.baseinfoForm.model = info.model || ''
      this.baseinfoForm.price = info.price
      this.baseinfoForm.remark = info.remark || ''
      this.baseinfoForm.inventory = info.inventory || ''

      if (this.goodsType === GOODS_TYPE.DIY) {
        this.$refs.backPrintParam.setPrintParam(info.img_print_param)
        this.$refs.leftPrintParam.setPrintParam(info.img_print_param_left)
        this.$refs.rightPrintParam.setPrintParam(info.img_print_param_right)
        this.$refs.topPrintParam.setPrintParam(info.img_print_param_top)
        this.$refs.bottomPrintParam.setPrintParam(info.img_print_param_bottom)
      }

      if (this.goodsType === GOODS_TYPE.DIY || this.goodsType === GOODS_TYPE.NORM) {
        this.basePicForm.opt_color_list = info.opt_color_list || []
        this.attachListForm.attach_list_str = info.attach_list_str

        this.basePicForm.opt_color_list.forEach((item) => {
          item.color_img_url = this.getImgUrl(44, 64, item.color_img, 7)
          item.outline_img_url = this.getImgUrl(44, 64, item.outline_img, 3)

          item.left.color_img_url = this.getImgUrl(44, 64, item.left.color_img, 7)
          item.left.outline_img_url = this.getImgUrl(44, 64, item.left.outline_img, 3)
          item.right.color_img_url = this.getImgUrl(44, 64, item.right.color_img, 7)
          item.right.outline_img_url = this.getImgUrl(44, 64, item.right.outline_img, 3)
          item.top.color_img_url = this.getImgUrl(44, 64, item.top.color_img, 7)
          item.top.outline_img_url = this.getImgUrl(44, 64, item.top.outline_img, 3)
          item.bottom.color_img_url = this.getImgUrl(44, 64, item.bottom.color_img, 7)
          item.bottom.outline_img_url = this.getImgUrl(44, 64, item.bottom.outline_img, 3)

          // <<<<<<<<<<<<<<<<<<<<<<<<< 兼容后台数据格式不正确时候
          if (!Array.isArray(item.warehouse_inventory)) {
            item.warehouse_inventory = [
              {
                inventory: '',
                warehouse_id: ''
              }
            ]
          }
        })
      }

      if (this.goodsType === GOODS_TYPE.GIFT) {
        this.baseinfoForm.warehouse_inventory = ((info.opt_color_list || [])[0] || {})
          .warehouse_inventory || [
          {
            inventory: '',
            warehouse_id: ''
          }
        ]
        this.baseinfoForm.sku = ((info.opt_color_list || [])[0] || {}).sku
      }

      this.handlerBrandChange(this.baseinfoForm.brand)
      this.baseinfoForm.model = info.model || ''
    },
    async handlerSaveBtnClick() {
      const data = {
        opr: 'save_goods_info'
      }

      if (this.goodsType === GOODS_TYPE.DIY) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')
        const basePicValidate = await this.validateForm('basePicForm')

        const img_print_param = await this.$refs.backPrintParam.getPrintParam()
        const img_print_param_left = await this.$refs.leftPrintParam.getPrintParam()
        const img_print_param_right = await this.$refs.rightPrintParam.getPrintParam()
        const img_print_param_top = await this.$refs.topPrintParam.getPrintParam()
        const img_print_param_bottom = await this.$refs.bottomPrintParam.getPrintParam()

        if (
          !baseinfoValidate ||
          // !printinfoValidate ||
          !basePicValidate ||
          !img_print_param ||
          !img_print_param_left ||
          !img_print_param_right ||
          !img_print_param_top ||
          !img_print_param_bottom
        ) {
          return
        }

        data.goods_name = this.baseinfoForm.goods_name
        data.type = this.baseinfoForm.type
        data.raw_material = this.baseinfoForm.raw_material
        data.brand = this.baseinfoForm.brand
        data.model = this.baseinfoForm.model
        data.price = this.baseinfoForm.price
        data.remark = this.baseinfoForm.remark

        delete img_print_param.price
        data.img_print_param = img_print_param
        data.img_print_param_left = img_print_param_left
        data.img_print_param_right = img_print_param_right
        data.img_print_param_top = img_print_param_top
        data.img_print_param_bottom = img_print_param_bottom

        this.basePicForm.opt_color_list.forEach((item) => {
          let inventory = 0
          item.warehouse_inventory.forEach((warehouse) => {
            inventory += warehouse.inventory
          })
          item.inventory = inventory
        })
        data.opt_color_list = this.basePicForm.opt_color_list
        data.attach_list_str = this.attachListForm.attach_list_str
      } else if (this.goodsType === GOODS_TYPE.NORM) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')
        const basePicValidate = await this.validateForm('basePicForm')

        if (!baseinfoValidate || !basePicValidate) return

        data.goods_name = this.baseinfoForm.goods_name
        data.type = this.baseinfoForm.type
        data.raw_material = this.baseinfoForm.raw_material
        data.brand = this.baseinfoForm.brand
        data.model = this.baseinfoForm.model
        data.price = this.baseinfoForm.price
        data.remark = this.baseinfoForm.remark

        this.basePicForm.opt_color_list.forEach((item) => {
          let inventory = 0
          item.warehouse_inventory.forEach((warehouse) => {
            inventory += warehouse.inventory
          })
          item.inventory = inventory
        })
        data.opt_color_list = this.basePicForm.opt_color_list
        data.attach_list_str = this.attachListForm.attach_list_str
      } else if (this.goodsType === GOODS_TYPE.GIFT) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')

        if (!baseinfoValidate) return

        data.goods_name = this.baseinfoForm.goods_name
        data.type = this.baseinfoForm.type
        data.inventory = this.baseinfoForm.inventory
        data.price = this.baseinfoForm.price
        data.remark = this.baseinfoForm.remark

        /**
         * 修改为多库存
         */
        let inventory = 0
        this.baseinfoForm.warehouse_inventory.forEach((item) => {
          inventory += item.inventory
        })
        data.inventory = inventory

        data.opt_color_list = [
          {
            color_name: '', // 颜色
            inventory: inventory, // 库存量（各仓库库存之和）
            color_img: '', // 底图(只是图片文件名，不是url)
            outline_img: '', // 当前商品颜色对应的轮廓图
            sku: this.baseinfoForm.sku, // sku编码
            warehouse_inventory: this.baseinfoForm.warehouse_inventory
          }
        ]
      }

      // 是否编辑
      if (this.goods_id) {
        data.goods_id = this.goods_id
      }

      console.log('商品保存 req=>', data)
      const resp = await goodsSave(data)
      console.log('商品保存 res=>', resp)

      if (resp.ret !== 0) return

      this.$notify({
        title: '成功',
        message: this.goods_id ? '保存成功' : '提交成功',
        type: 'success',
        duration: 2000
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 2000)
    },
    getSkuType() {
      if (this.goodsType === GOODS_TYPE.DIY || this.goodsType === GOODS_TYPE.NORM) {
        this.getSku()
      } else {
        this.getSkuGift()
      }
    },
    async getSku() {
      if (
        !this.baseinfoForm.raw_material ||
        !this.baseinfoForm.brand ||
        !this.baseinfoForm.model ||
        !this.baseinfoForm.goods_name ||
        !this.baseinfoForm.type
      ) {
        return
      }

      const skuCreateBaseInfo = {
        raw_material: this.baseinfoForm.raw_material,
        brand: this.baseinfoForm.brand,
        model: this.baseinfoForm.model,
        goods_name: this.baseinfoForm.goods_name,
        type: this.baseinfoForm.type
      }
      const list = (this.basePicForm.opt_color_list || []).map((item, index) => {
        return {
          index: index,
          color_name: item.color_name,
          sku: item.sku,
          ...skuCreateBaseInfo
        }
      })

      if (list.length === 0) return

      const data = {
        opr: 'goods_sku_create',
        list
      }

      const resp = await goodsGet(data)
      if (resp.ret !== 0) return

      console.log('sku resp=>', resp)
      const respList = resp.data.list || []

      respList.forEach((item) => {
        this.basePicForm.opt_color_list[item.index].sku = item.sku
      })
    },
    async getSkuGift() {
      if (!this.baseinfoForm.goods_name || !this.baseinfoForm.type) {
        return
      }

      const data = {
        opr: 'goods_sku_create',
        list: [
          {
            goods_name: this.baseinfoForm.goods_name,
            type: this.baseinfoForm.type,
            raw_material: '',
            brand: '',
            model: '',
            color_name: '',
            index: 0,
            sku: this.baseinfoForm.sku
          }
        ]
      }

      const resp = await goodsGet(data)
      if (resp.ret !== 0) return

      console.log('gift sku resp=>', resp)
      const respList = resp.data.list || []
      this.baseinfoForm.sku = (respList[0] || {}).sku
    },
    handlerOutlineImgSuccess({ img_name }, row) {
      row.color_img = img_name
      row.color_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=44&height=64&type=7&img_name=${img_name}`
    },
    handlerOutlineImgSuc({ img_name }, row) {
      row.outline_img = img_name
      row.outline_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=44&height=64&type=3&img_name=${img_name}`
    },
    handlerBrandChange(brand_id) {
      this.baseinfoForm.model = ''
      this.phone_brand_list.forEach((brand) => {
        if (brand.brand_id === brand_id) {
          this.model_list = brand.model_list
        }
      })
      this.getSku()
    },
    /**
     * 添加仓库库存输入
     */
    handleAddWarehouseClick(row) {
      row.warehouse_inventory.push({ warehouse_id: '', inventory: '' })
    },
    /**
     * 删除仓库库存输入
     */
    handleDelWarehouseClick(row, i) {
      row.warehouse_inventory.splice(i, 1)
    },
    /**
     * 获取仓库列表
     */
    async getWarehouseList() {
      const data = {
        opr: 'get_warehouse_list'
      }

      // console.log('仓库列表 req=>', data)
      const resp = await warehouseGet(data)
      // console.log('仓库列表 res=>', resp)

      if (resp.ret !== 0) return

      this.warehouseList = resp.data.list || []
    },
    handleGiftWarehouseAddClick() {
      this.baseinfoForm.warehouse_inventory.push({ warehouse_id: '', inventory: '' })
    },
    handleGifeWarehousedelClick(i) {
      this.baseinfoForm.warehouse_inventory.splice(i, 1)
    },
    getImgUrl(width, height, img_name, type) {
      return `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=${type}&width=${width}&height=${height}&img_name=${img_name}`
    },
    handleLeftColorImgSuc({ img_name }, row) {
      row.left.color_img = img_name
      row.left.color_img_url = this.getImgUrl(44, 64, img_name, 7)
    },
    handleLeftOutlineImgSuc({ img_name }, row) {
      row.left.outline_img = img_name
      row.left.outline_img_url = this.getImgUrl(44, 64, img_name, 3)
    },
    handleRightColorImgSuc({ img_name }, row) {
      row.right.color_img = img_name
      row.right.color_img_url = this.getImgUrl(44, 64, img_name, 7)
    },
    handleRightOutlineImgSuc({ img_name }, row) {
      row.right.outline_img = img_name
      row.right.outline_img_url = this.getImgUrl(44, 64, img_name, 3)
    },
    handleTopColorImgSuc({ img_name }, row) {
      row.top.color_img = img_name
      row.top.color_img_url = this.getImgUrl(44, 64, img_name, 7)
    },
    handleTopOutlineImgSuc({ img_name }, row) {
      row.top.outline_img = img_name
      row.top.outline_img_url = this.getImgUrl(44, 64, img_name, 3)
    },
    handleBottomColorImgSuc({ img_name }, row) {
      row.bottom.color_img = img_name
      row.bottom.color_img_url = this.getImgUrl(44, 64, img_name, 7)
    },
    handleBottomOutlineImgSuc({ img_name }, row) {
      row.bottom.outline_img = img_name
      row.bottom.outline_img_url = this.getImgUrl(44, 64, img_name, 3)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  min-width: 1035px;
}
.title-wrapper {
  height: 54px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  .title-text {
    font-size: 16px;
    color: #666;
  }
}

.baseinfo-form-wrapper {
  // max-width: 1035px;
  .baseinfo-title-wrapper {
    padding: 24px 30px;
  }
}
.attach-list-form-wrapper {
  // max-width: 1035px;
  .baseinfo-title-wrapper {
    padding: 24px 30px;
  }
}
.printinfo-form-wrapper {
  // max-width: 1035px;
  .baseinfo-title-wrapper {
    padding: 24px 30px;
  }
}

.base-pic-wrapper {
  // max-width: 1035px;
  .base-pic-title-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 24px 20px 24px 30px;
    .add-btn-wrapper {
      color: #2584f9;
      cursor: pointer;
      .el-icon-circle-plus {
        font-size: 20px;
      }
      .add-btn-text {
        font-size: 16px;
        vertical-align: text-bottom;
      }
    }
  }
  .base-pic-table-wrapper {
    margin: 0 20px 40px 70px;
    .el-table {
      /deep/ .el-table__body-wrapper {
        td {
          padding: 0;
        }
      }
    }
    .text-btn {
      color: #e33119;
    }
  }
  .base-image-wrapper {
    display: inline-block;
    height: 60px;
    width: 44px;
    vertical-align: middle;
    border: 1px solid #ccc;
  }
  .pictable-form-item {
    margin: 16px 0;
  }
}
.gray-border-bottom {
  border-bottom: 1px solid #e6e6e6;
}
.button-group-wrapper {
  padding: 24px 0 32px;
  text-align: center;

  .el-button:first-child {
    margin-right: 40px;
  }
}
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
/deep/ .outline-uploader {
  line-height: 0;
  .el-upload {
    border: 1px dashed #e6e6e6;
    border-radius: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #2584f9;
  }
  .avatar-uploader-icon {
    font-size: 30px;
    color: #2584f9;
    width: 44px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .upload-preview {
    width: 44px;
    height: 60px;
    display: block;
  }
}

/** 仓库库存 start */
.warehouse-addbtn-wrapper {
  text-align: left;
  margin: 5px 0;
  .el-button--mini {
    padding: 7px 8px;
  }
}

.warehouse-form-item {
  margin-bottom: 16px;

  /deep/ .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
  }

  /deep/ .el-form-item__content {
    line-height: 28px;
  }

  .el-button--mini {
    padding: 7px 8px;
  }
}

.gift-warehouse-inventory {
  .el-button {
    height: 38px;
  }
  .gift-item {
    margin-bottom: 22px;

    &:last-child {
      margin-bottom: 0;
    }
  }
  .gift-inventory-form-item {
    padding-right: 10px;
  }
}
/** 仓库库存 end */

.lrtb-upload-wrapper {
  display: flex;
  /deep/ .lrtb-form-item {
    margin-right: 20px;
    margin-bottom: 25px;
    .el-form-item__label {
      line-height: 30px;
    }
    .el-form-item__error {
      left: -40px;
    }
  }
}
</style>
