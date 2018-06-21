import 'amcharts3'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/plugins/dataloader'

function createChart (data) {
  return window.AmCharts.makeChart('ob-chart', {

    // custom loader function to dynamically update
    load: function (data) {
      this.dataProvider = data
      this.validateData()
    },

    type: 'serial',
    theme: 'light',
    dataProvider: [],
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
      'lineAlpha': 1,
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
    }],
    categoryField: 'value',
    chartCursor: {},
    balloon: {
      textAlign: 'left'
    },
    valueAxes: [{
      title: 'Volume'
    }],
    categoryAxis: {
      title: 'Price (BTC/ETH)',
      minHorizontalGap: 100,
      startOnAxis: true,
      showFirstLabel: false,
      showLastLabel: false
    }
  })
}

function balloon (item, graph) {
  let type = graph.id
  let chart = graph.chart

  return [
    'Bid: <strong>',
    formatNumber(item.dataContext.value, chart, 4),
    '</strong><br />',
    'Total Volume: <strong>',
    formatNumber(item.dataContext[`${type}.volume.total`], chart, 4),
    '</strong><br />',
    'Volume: <strong>',
    formatNumber(item.dataContext[`${type}.volume`], chart, 4),
    '</strong>'
  ].join('')
}

function formatNumber (val, chart, precision) {
  return window.AmCharts.formatNumber(val, {
    precision: precision || chart.precision,
    decimalSeparator: chart.decimalSeparator,
    thousandsSeparator: chart.thousandsSeparator
  })
}

export default { createChart }
