<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎ ' + showTitle }}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref">

    </div>
  </div>
</template>

<script>
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj)
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      showChoice: false, // 是否显示可选项
      choiceType: 'map', // 显示的数据的类型
      titleFontSize: 0 // 指明标题文字大小
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
  computed: {
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      unwarp(this.chartInstance).setOption(initOption)
    },
    async getData () {
      // await this.$http.get()
      // 对allData进行赋值
      const { data: ret } = await this.$http.get('trend')
      this.allData = ret
      console.log(ret)
      this.updateChart()
    },
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(252, 151, 192, 0.5)',
        'rgba(135, 247, 207, 0.5)',
        'rgba(247, 244, 148, 0.5)',
        'rgba(114, 204, 255, 0.5)',
        'rgba(247, 197, 160, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(252, 151, 192, 0)',
        'rgba(135, 247, 207, 0)',
        'rgba(247, 244, 148, 0)',
        'rgba(114, 204, 255, 0)',
        'rgba(247, 197, 160, 0)'
      ]
      // 处理数据
      // 类目轴的数据
      const timeArr = this.allData.common.month
      // y轴的数据 series下的数据
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                // 0%时的颜色
                offset: 0,
                color: colorArr1[index]
              },
              {
                // 100%时的颜色
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      unwarp(this.chartInstance).setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      unwarp(this.chartInstance).setOption(adapterOption)
      unwarp(this.chartInstance).resize()
    },
    handleSelect (currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}

.select-con {
  background-color: #293441;
}

.select-item {
  cursor: pointer;
}
</style>
