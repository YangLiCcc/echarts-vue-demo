<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref">

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import China from '../../public/static/map/china.json'
import { getProvinceMapInfo } from '../utils/map_utils'
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj)
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      mapData: [] // 存储地图数据
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destoryed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      // 获取中国地图的矢量数据
      // const chinaMap = China
      // console.log(chinaMap)
      // 注册地图组件
      this.$echarts.registerMap('china', China)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      unwarp(this.chartInstance).setOption(initOption)
      unwarp(this.chartInstance).on('click', async arg => {
        // arg.name 可得到所点击的省份
        // console.log(arg)
        const provienceInfo = getProvinceMapInfo(arg.name)
        // console.log(provienceInfo)
        if (!this.mapData[provienceInfo.key]) {
          // 获取该省份的地图矢量数据
          const ret = await axios.get('http://localhost:8080' + provienceInfo.path)
          this.mapData[provienceInfo.key] = ret.data
          // console.log(ret)
          this.$echarts.registerMap(provienceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provienceInfo.key
          }
        }
        unwarp(this.chartInstance).setOption(changeOption)
      })
    },
    async getData () {
      // 获取服务器的数据，对this.allData进行赋值之后，调用this.updateChart方法进行更新图表
      const { data: ret } = await this.$http.get('map')
      // 对allData进行赋值
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 处理数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        // 返回的这个对象就代表是一个类别下的所有散点数据
        // 如果想在地图中显示散点的数据，则需要给散点的图表增加一个配置，即coordinateSystem: 'geo'
        return {
          type: 'effectScatter',
          ripperEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      unwarp(this.chartInstance).setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      unwarp(this.chartInstance).setOption(adapterOption)
      unwarp(this.chartInstance).resize()
    },
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      unwarp(this.chartInstance).setOption(revertOption)
    }
  }
}
</script>

<style>

</style>
