<template>
  <div>

    <div style="margin-bottom:20px;">
      <el-autocomplete
        class="inline-input"
        v-model="keyword"
        style="width:80%;margin-right:20px;"
        :fetch-suggestions="querySearch"
        placeholder="请输入关键词来搜索定位"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
    </div>
    <baidu-map
      ref="MapRef"
      class="bm-view"
      :ak="ak"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="ready"
    >
      <bm-local-search
        v-show="false"
        :keyword="keyword"
        :auto-viewport="true"
        @searchcomplete="onSearchComplete"
      ></bm-local-search>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-marker
        :position="syncCurLocation"
        :dragging="true"
        animation="BMAP_ANIMATION_BOUNCE"
        @dragend="onDragend"
      >
        <bm-label
          content="请移动此标志,选择位置"
          :labelStyle="{color: 'red', fontSize : '16px'}"
          :offset="{width: -70, height: 30}"
        />
      </bm-marker>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
        @locationSuccess="onLocationSuccess"
      ></bm-geolocation>
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import BmLabel from 'vue-baidu-map/components/overlays/Label.vue'
import BmCityList from 'vue-baidu-map/components/controls/CityList.vue'

import BmNavigation from 'vue-baidu-map/components/controls/Navigation'

import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation'
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch'
export default {
  name: 'CustomizeMap',
  components: {
    BaiduMap,
    BmMarker,
    BmLabel,
    BmNavigation,
    BmCityList,
    BmGeolocation,
    BmLocalSearch
  },
  props: {
    curLocation: {
      type: Object,
      require: true,
      default: () => {
        return { lng: 116.404, lat: 39.915 }
      }
    }
  },
  data () {
    return {
      ak: 'eP5w44TSYzinF4qofP3t6K0KS2mOh9Gn',
      zoom: 15,
      labelStyle: { color: 'red', fontSize: '18px' },
      center: { lng: 116.404, lat: 39.915 },
      keyword: '',
      searchResults: [],
      searchCompleted: false,
      syncCurLocation: { lng: 116.404, lat: 39.915 }, //TODO:外部传入
      emitFromDrag: false
    }
  },
  watch: {
    curLocation: {
      handler (newVal, oldVal) {
        if ((newVal?.lat !== this.syncCurLocation.lat || newVal?.lng !== this.syncCurLocation.lng) && !(newVal?.lat === '' && newVal?.lng==='')) {
          this.syncCurLocation = newVal;
        } else if (newVal?.lat === '' && newVal?.lng==='') {
          this.syncCurLocation = { lng: 116.404, lat: 39.915 };
        }
      },
      deep: true,
      immediate: true
    },
    keyword: {
      handler (newVal, oldVal) {

        const res = this.searchResults.filter(el => el.title === newVal);
        if (res.length !== 0) {
          this.syncCurLocation = res[0].location;
          this.$next(() => {
            this.center = this.syncCurLocation;
          })
        } else {
          //
        }
      }
    },
    syncCurLocation: {
      handler (newVal, oldVal) {
        this.analysisAddress([newVal], res => {
          this.keyword = res[0];
        })
      },
      deep: true,
      //immediate:true
    }
  },
  methods: {
    /*
  * @title 解析百度地图坐标地址
  * @params arr array 坐标参数 不能为空
  * @params callBack function 回调返回解析值
  * @return searchGeo callback 递归计算
  */
    analysisAddress: (arr, callBack) => {
      // 判断传入的arr是否为数组
      if (!Array.isArray(arr) || arr.length === 0) {
        // eslint-disable-next-line no-throw-literal
        throw "arr not a Array or arr not is null Array!";
      }

      // eslint-disable-next-line no-undef
      var Geo = new BMap.Geocoder();
      var adds = arr;
      var addressList = [];
      let i = 0;

      // 逐个逆向解析
      async function searchGeo () {
        // 传入的坐标必须是数字
        if (isNaN(adds[i].lng) || isNaN(adds[i].lat)) {
          // eslint-disable-next-line no-throw-literal
          throw "adds[i].lng or adds[i].lat is not a number!";
        }

        // eslint-disable-next-line no-undef
        let point = new BMap.Point(adds[i].lng, adds[i].lat);
        await Geo.getLocation(point, rs => {
          var addComp = rs.addressComponents;
          addressList.push(
            addComp.province +
            " " +
            addComp.city +
            " " +
            addComp.district +
            " " +
            addComp.street +
            " " +
            addComp.streetNumber
          );
          if (i < arr.length - 1) {
            i++;
            return searchGeo();
          } else {
            callBack(addressList);
          }
        });
      }
      return searchGeo();
    },
    ready ({ BMap, map }) {
      //console.log(BMap, map)
      if (this.syncCurLocation?.lng && this.syncCurLocation?.lat) {
        this.analysisAddress([this.syncCurLocation], res => {
          this.keyword = res[0];
        })
      }
      //this.zoom = 15
      /* map.setMapStyle({ style: 'midnight' }) */
    },
    onSearchComplete (results) {
      if (results) {
        this.searchResults = results.Hr.map(el => {
          return {
            title: el.title,
            location: {
              lat: el.point.lat,
              lng: el.point.lng
            }
          }
        });
        this.searchCompleted = true;
        console.log(results, this.searchResults, '=====结果')

      }
    },
    querySearch (queryString, cb) {
      let circulSearchId = setInterval(() => {
        if (this.searchCompleted) {
          clearInterval(circulSearchId);
          const res = this.searchResults.map(el => ({ value: el.title, location: el.location }));
          cb(res);
        }
      }, 50);
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect (item) {
      //console.log(item, '选中了');

    },
    onDragend (event) {
      if (this.syncCurLocation.lat !== event.point.lat || this.syncCurLocation.lng !== event.point.lng) {
        this.emitFromDrag = true;
        this.syncCurLocation = event.point;
        //console.log(event, '拖拽===')
      }
    },
    onLocationSuccess ({ point }) {
      //console.log(point, '定位===');
      this.syncCurLocation = { lat: point.lat, lng: point.lng };
    }
  }
}
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 300px;
}
.bm-view /deep/ .anchorBL {
  display: none;
}
</style>
