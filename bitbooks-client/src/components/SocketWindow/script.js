export default {

  name: 'SocketWindow',

  methods: {

    onMessage: function (message) {
      console.log(`message: ${message}`)
    }

  },

  created: function () {
    this.$socket.$on('message', this.onMessage)
  }

}
