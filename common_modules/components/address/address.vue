<template>
  <el-row :class="['sinosoft-address', {'address-vertical': vertical}]" :gutter="30">
    <el-col :span="vertical ? 24 : limit == 'province' || limit == 'city' ? 12 : 8">
      <el-select v-model="province" placeholder="省">
        <el-option
          v-for="(value, key) in add.address"
          :label="key"
          :value="key">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="vertical ? 24 : limit == 'city' ? 12 : 8" v-if="limit != 'province'">
      <el-select v-model="city" placeholder="市">
        <el-option
          v-for="(value, key) in getCities"
          :label="key"
          :value="key">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="vertical ? 24 : 8" v-if="limit == 'district' || limit == 'site'">
      <el-select v-model="district" placeholder="区">
        <el-option
          v-for="value in getDistrict"
          :label="value"
          :value="value">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="24" v-if="limit == 'site'" class="sinosoft-address-site">
      <el-input v-model="site" placeholder="详细地址"></el-input>
    </el-col>
  </el-row>
</template>

<script>
  const addressJson = require('./address.js');

  module.exports = {
    name: 'sinosoft_address',//组件名
    data() {
      return {
        add: addressJson
      };
    },
    computed: {
      getCities() { //获取当前所在省下的市，若为直辖市则市为省
        var address = this.add.address; //省市区信息
        var municipality = this.add.municipality; //直辖市列表
        var obj = {};
        obj[''] = '';
        if (_.contains(municipality, this.province)) {//判断是否为直辖市，获取市的列表
          obj[this.province] = _.keys(address[this.province]);
        } else {
          obj = address[this.province] ? address[this.province] : {};
        }
        return obj;
      },
      getDistrict() {//获取地区列表
        let obj = this.city && this.getCities[this.city] || [];

        if (!_.contains(obj, '')) {
          obj.unshift('');
        }
        return obj;
      },
      address() {
        var {province, city, district, site, limit} = this;
        return limit == 'province' ? {province} : limit == 'city' ? {province, city} : limit == 'district' ? {
          province,
          city,
          district
        } : {province, city, district, site};
      }
    },
    watch: {
      'province': function () {
        this.city = '';
      },
      'city': function () {
        this.district = '';
      }
    },
    methods: {
      clear() {
        this.province = '';
        this.city = '';
        this.district = '';
        this.site = '';
      }
    },
    props: {
      province: {
        type: String,
        default: ''
      },
      city: {
        type: String,
        default: ''
      },
      district: {
        type: String,
        default: ''
      },
      site: {
        type: String,
        default: ''
      },
      limit: {
        type: String,
        validator(value) {
          let limit = value.toLowerCase();
          return _.indexOf(['province', 'city', 'district', 'site'], limit) != -1;
        },
        default: 'district'
      },
      vertical: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="less" src="./address.less" scoped></style>

