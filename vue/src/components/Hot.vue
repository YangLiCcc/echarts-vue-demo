<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref">

    </div>
    <span class="iconfont arr-left" @click="handleClick('left')" :style="com_style">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="handleClick('right')" :style="com_style">&#xe6ed;</span>
    <span class="cat-name" :style="com_style">{{ catName }}</span>
  </div>
</template>

<script>
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj)
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      currentIndex: 0, // 当前所展示的页面
      titleFontSize: 0
    }
  },
  computed: {
    catName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    com_style () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
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
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎热销商品销售金额占比统计',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `
              ${item.name}:${parseInt(item.value / total * 100) + '%<br/>'}
              `
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      unwarp(this.chartInstance).setOption(initOption)
    },
    async getData () {
      const { data: ret } = await this.$http.get('hotproduct')
      // 对allData进行赋值
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      const legendArr = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const seriesArr = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      // 处理数据
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: [
          {
            data: seriesArr
          }
        ]
      }
      unwarp(this.chartInstance).setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      unwarp(this.chartInstance).setOption(adapterOption)
      unwarp(this.chartInstance).resize()
    },
    handleClick (val) {
      if (val === 'left') {
        if (--this.currentIndex < 0) {
          this.currentIndex = this.allData.length - 1
        }
      } else if (val === 'right') {
        if (++this.currentIndex > this.allData.length - 1) {
          this.currentIndex = 0
        }
      }
      this.updateChart()
    }
  }
}
</script>

<style>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.cat-name {
  position: absolute;
  bottom: 10%;
  left: 80%;
  color: white;
}
</style>
