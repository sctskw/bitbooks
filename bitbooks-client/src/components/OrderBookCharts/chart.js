import 'amcharts3'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/plugins/dataloader'

function createDepth (opts) {
  function formatNumber (val, chart, precision) {
    return window.AmCharts.formatNumber(val, {
      precision: precision || chart.precision,
      decimalSeparator: chart.decimalSeparator,
      thousandsSeparator: chart.thousandsSeparator
    })
  }

  function balloon (item, graph) {
    let type = graph.id
    let chart = graph.chart
    let data = item.dataContext
    let exchanges = data.exchanges

    let value = parseFloat(data.value)
    let total = data[`${type}.volume.total`]
    let volume = parseFloat(data[`${type}.volume`])
    let label = type.slice(0, -1).toUpperCase()

    let html = [
      `${label} Price: <strong>`,
      formatNumber(value, chart, 8),
      '</strong><br />',
      'Total Volume: <strong>',
      formatNumber(total, chart, 8),
      '</strong><br />',
      'Volume: <strong>',
      formatNumber(volume, chart, 8),
      '</strong><br />',
      '---------------------'
    ]

    for (let ex in exchanges) {
      let title = ex.split('::')[0].toUpperCase()
      let value = exchanges[ex]
      let sub = [
        '<br/>',
        `${title} Volume: <strong>`,
        formatNumber(value, chart, 8),
        '</strong>'
      ]

      html = html.concat(sub)
    }

    return html.join('')
  }

  return createChart(Object.assign(opts, {
    type: 'serial',
    graphs: [{
      id: 'bids',
      fillAlphas: 0.1,
      lineAlpha: 1,
      lineThickness: 2,
      lineColor: '#0f0',
      type: 'step',
      valueField: 'bids.volume.total',
      balloonFunction: balloon
    }, {
      id: 'asks',
      fillAlphas: 0.1,
      lineAlpha: 1,
      lineThickness: 2,
      lineColor: '#f00',
      type: 'step',
      valueField: 'asks.volume.total',
      balloonFunction: balloon
    }, {
      lineAlpha: 0,
      fillAlphas: 0.2,
      lineColor: '#000',
      type: 'column',
      clustered: false,
      valueField: 'bids.volume',
      showBalloon: false
    }, {
      lineAlpha: 0,
      fillAlphas: 0.2,
      lineColor: '#000',
      type: 'column',
      clustered: false,
      valueField: 'asks.volume',
      showBalloon: false
    }]
  }))
}

function createNegativeBar (opts) {
  function tooltip (data, graph, positive) {
    let price = data.category
    let value = data.values.value
    let pointer = graph.valueField
    let exchange = pointer.split('.')[2].split('::')[0]
    let type = (value <= 0 ? 'asks' : 'bids')

    return `[${exchange}] <strong>${Math.abs(value)}</strong>
      ${type} @ <strong>${price}</strong>`
  }

  return createChart(Object.assign(opts, {
    rotate: true,
    type: 'serial',
    theme: 'light',
    addClassNames: true,
    autoMargins: true,
    marginLeft: 50,
    marginBottom: 100,
    valueAxes: [{
      id: 'v1',
      title: 'Volume',
      stackType: 'regular',
      axisAlpha: 0.2,
      gridAlpha: 0,
      position: 'left',
      ignoreAxisWidth: false
    }],
    balloon: {
      fixedPosition: true
    },
    startDuration: 1,
    graphs: [{
      alphaField: 'alpha',
      balloonFunction: tooltip,
      clustered: false,
      dashLengthField: 'dashLengthColumn',
      fillAlphas: 0.5,
      lineAlpha: 0.5,
      lineColor: '#0082d7',
      type: 'column',
      valueField: 'asks.exchange.bittrex::BTC_ETH'
    }, {
      alphaField: 'alpha',
      balloonFunction: tooltip,
      clustered: false,
      dashLengthField: 'dashLengthColumn',
      fillAlphas: 1,
      lineAlpha: 1,
      lineColor: '#0082d7',
      type: 'column',
      valueField: 'bids.exchange.bittrex::BTC_ETH'
    }, {
      alphaField: 'alpha',
      balloonFunction: tooltip,
      clustered: false,
      dashLengthField: 'dashLengthColumn',
      fillAlphas: 0.5,
      lineAlpha: 0.5,
      lineColor: '#2da0a3',
      stackable: true,
      type: 'column',
      valueField: 'asks.exchange.poloniex::BTC_ETH'
    }, {
      alphaField: 'alpha',
      balloonFunction: tooltip,
      clustered: false,
      dashLengthField: 'dashLengthColumn',
      fillAlphas: 1,
      lineAlpha: 0,
      lineColor: '#2da0a3',
      stackable: true,
      type: 'column',
      valueField: 'bids.exchange.poloniex::BTC_ETH'
    }],
    categoryField: 'price',
    categoryAxis: {
      gridPosition: 'start',
      axisAlpha: 0,
      tickLength: 0,
      title: 'Price (BTC/ETH)'
    }
  }))
}

function createChart (opts) {
  let id = opts && opts.id
  let title = opts && opts.title

  if (!id) throw new Error('no ID provided for chart')

  delete opts.id
  delete opts.title

  return window.AmCharts.makeChart(id, Object.assign({
    // custom loader function to dynamically update
    load: function (data) {
      this.dataProvider = data
      this.validateData()
    },
    theme: 'light',
    categoryField: 'value',
    autoMargins: true,
    valueAxes: [{
      title: 'Volume'
    }],
    categoryAxis: {
      title: title,
      minHorizontalGap: 100,
      startOnAxis: true,
      showFirstLabel: false,
      showLastLabel: false
    },
    dataProvider: [],
    chartCursor: {},
    balloon: {
      textAlign: 'left'
    }
  }, opts))
}

export default {
  createChart,
  createDepth,
  createNegativeBar
}
