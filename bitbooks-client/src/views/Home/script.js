// @ is an alias to /src
// import SocketWindow from '@/components/SocketWindow/index.vue'
import OrderBookSummary from '@/components/OrderBookSummary/index.vue'
import OrderBookCharts from '@/components/OrderBookCharts/index.vue'
import OrderBookGrid from '@/components/OrderBookGrid/index.vue'

export default {
  name: 'home',
  components: {
    OrderBookSummary,
    OrderBookCharts,
    OrderBookGrid
  }
}
