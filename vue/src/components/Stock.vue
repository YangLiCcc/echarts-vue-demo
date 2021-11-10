<template>
  <div class="com-container">
    Stock.vue
    <div class="com-chart" ref="stock_ref">

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
      currentIndex: 0
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
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
        }
      }
      unwarp(this.chartInstance).setOption(initOption)
    },
    async getData () {
      const { data: ret } = await this.$http.get('stock')
      // 对allData进行赋值
      this.allData = ret
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      // 处理数据
      const certerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      // console.log(colorArr[0][0])
      // console.log(this.allData)
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        // console.log(index)
        // console.log(colorArr[index][1])
        return {
          type: 'pie',
          radius: [110, 100],
          center: certerArr[index],
          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales,
              label: {
                show: true
              },
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ],
          hoverAnimation: false,
          labelLine: {
            show: false // 隐藏指示线
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          }
        }
      })
      const dataOption = {
        series: seriesArr
      }
      unwarp(this.chartInstance).setOption(dataOption)
    },
    screenAdapter () {
      const adapterOption = {}
      unwarp(this.chartInstance).setOption(adapterOption)
      unwarp(this.chartInstance).resize()
    },
    startInterval () {
      setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        // 更新界面显示
        this.updateChart()
      }, 5000)
    }
  }
}
</script>

<style>

</style>
