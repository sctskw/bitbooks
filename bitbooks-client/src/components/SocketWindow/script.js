export default {

  name: 'SocketWindow',

  props: ['socket'],

  methods: {

    onMessage: function (message) {
      console.log(`message: ${message}`)
    }

  },

  created: function () {
    this.$socket.$on('data', this.onMessage)
  }

}
