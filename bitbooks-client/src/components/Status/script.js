import { mapGetters } from 'vuex'

export default {

  name: 'Status',

  computed: {
    ...mapGetters({
      connected: 'isConnected',
      updated: 'getLastUpdated'
    })
  }
}
