import 'amcharts3'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/plugins/dataloader'

function createSeries (opts) {
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

function balloon (item, graph) {
  let type = graph.id
  let chart = graph.chart
  let data = item.dataContext
  let exchanges = data.exchanges

  let value = data.value
  let total = data[`${type}.volume.total`]
  let volume = data[`${type}.volume`]

  let html = [
    'Bid: <strong>',
    formatNumber(value, chart, 4),
    '</strong><br />',
    'Total Volume: <strong>',
    formatNumber(total, chart, 4),
    '</strong><br />',
    'Volume: <strong>',
    formatNumber(volume, chart, 4),
    '</strong><br />',
    '---------------------'
  ]

  for (let ex in exchanges) {
    let title = ex.split('::')[0].toUpperCase()
    let value = exchanges[ex]
    let sub = [
      '<br/>',
      `${title} Volume: <strong>`,
      formatNumber(value, chart, 4),
      '</strong>'
    ]

    html = html.concat(sub)
  }

  return html.join('')
}

function formatNumber (val, chart, precision) {
  return window.AmCharts.formatNumber(val, {
    precision: precision || chart.precision,
    decimalSeparator: chart.decimalSeparator,
    thousandsSeparator: chart.thousandsSeparator
  })
}

export default {
  createChart,
  createSeries
}
