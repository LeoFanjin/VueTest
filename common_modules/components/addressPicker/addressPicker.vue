<style scoped lang="less" src="./addressPicker.less"></style>

<template>
    <div class="sinosoft-address-picker" v-clickoutside="closeDialog">
        <el-input :placeholder="placeholder" v-model="addressDisplay" readonly="readonly" @focus="focus"></el-input>
        <!-- v-if 下有bug -->
        <div class="sinosoft-address-picker_dialog" v-show="isOpen">
            <div class="sinosoft-address-picker_dialog_body">
                <sinosoft_address ref="address" :province="province" :city="city" :district="district" :site="site" :limit="limit" :vertical="typeof vertical == 'boolean' && vertical || size <= 350"></sinosoft_address>
            </div>
            <div class="sinosoft-address-picker_dialog_foot">
                <button type="button" class="btn btn-primary" @click="pickAddress">确认</button>
                <button type="button" class="btn btn-default" @click="closeDialog">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
    var sinosoft_address = require('components/address');
    module.exports = {
      components: {
        sinosoft_address
      },
      mounted() {
        this.size = $(this.$el).width();
        $(window).on('resize', () => this.size = $(this.$el).width());
      },
      created () {
        if(this.validateLimit == null || this.validateLimit == '') {
          this.validateLimit = this.limit;
        }
      },
      data() {
        return {
          size: 0,
          isOpen: false
        };
      },
      computed: {
        addressDisplay() {
          var {addressValueArr: addressArr, isSatisfy} = this.isStatisfy();
          // return isSatisfy ? addressArr.join('-') : '';
          return isSatisfy ? _.without(addressArr, '').join('-') : '';
        },
        address() {
          var {province, city, district, limit} = this;
          return limit == 'province' ? {province} : limit == 'city' ? {province, city} : {province, city, district};
        }
      },
      methods: {
        isStatisfy (address) {
          var address = address || this;
          // var lastIndex = ['province', 'city', 'district', 'site'].reverse().indexOf(this.limit);
          var lastIndex = ['province', 'city', 'district', 'site'].reverse().indexOf(this.validateLimit);
          var limitIndex = ['province', 'city', 'district', 'site'].reverse().indexOf(this.limit);
          var {province, city, district, site} = address;
          // var addressValueArr = _.chain([province, city, district, site]).initial(lastIndex).value();
          var addressValueArr = _.chain([province, city, district, site]).initial(limitIndex).value();
          var _addressValueArr = _.chain([province, city, district, site]).initial(lastIndex).value();
          // var isSatisfy = addressValueArr.every(address => address);
          var isSatisfy = _addressValueArr.every(address => address);
          return {province, city, district, site, isSatisfy, addressValueArr};
        },
        pickAddress() {
          var address = this.$refs.address.address;
          var {province, city, district, site, isSatisfy} = this.isStatisfy(address);
          if (isSatisfy) {
            this.closeDialog();
            _.extend(this, {province, city, district, site});
            this.$emit('change', {province, city, district, site, isSatisfy});
          }

        },
        focus() {
          this.isOpen = true;
          setTimeout(() => $('.sinosoft-address-picker_dialog', this.$el).addClass('open'), 30);
        },
        closeDialog() {
          $('.sinosoft-address-picker_dialog', this.$el).removeClass('open');
          this.isOpen = false;
        }
      },
      props: {
        province: { //省
          type: String,
          default: ''
        },
        city: { //市
          type: String,
          default: ''
        },
        district: { //区
          type: String,
          default: ''
        },
        site: { //详细地址
          type: String,
          default: ''
        },
        //是否显示县、区、地址
        limit: {
          type: String,
          validator(value) {
            let limit = value.toLowerCase();
            return _.indexOf(['province', 'city', 'district'], limit) !== -1;
          },
          default: 'district'
        },
        validateLimit: {
          type: String,
          default: ''
        },
        //是否垂直显示，如果未设置根据占位大小来自适应
        vertical: {
          type: Boolean,
          default: ''
        },
        //输入框的placeholder
        placeholder: {
          type: String,
          default() { //根据limit的值显示默认的placeholder
            var lastIndex = ['province', 'city', 'district', 'site'].reverse().indexOf(this.limit);
            return _.initial(['省', '市', '区', '地址'],lastIndex).join('-');
          }
        },
      }
    };

    function hide() {

    }
</script>
