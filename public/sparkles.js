if (!window.debounce) {
  window.debounce = function (fn, delay) {
    var timer = null
    return function () {
      var context = this,
        args = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

document.body.innerHTML =
  '\n<svg id="svg-stash" role="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" hidden>\n <defs>\n  <symbol id="sparkle1" viewBox="0 0 100 100">\n   <polygon fill="white" points="50,100 47.5,50 50,0 52.5,50"/>\n   <polygon fill="white" points="100,50 50,52.5 0,50 50,47.5"/>\n  </symbol>\n\n  <symbol id="sparkle2" viewBox="0 0 100 100">\n   <polygon fill="white" points="32.322,67.678 49.116,49.116 67.678,32.322 50.884,50.884"/>\n   <polygon fill="white" points="67.678,67.678 49.116,50.884 32.322,32.322 50.884,49.116"/>\n  </symbol>\n </defs>\n</svg>\n\n'.concat(
    document.body.innerHTML
  )
var sparkleContainer = document.createElement('div'),
  svgNS = 'http://www.w3.org/2000/svg',
  sparkle = document.createElementNS(svgNS, 'svg'),
  prevDocumentWidth = null,
  slope
sparkleContainer.id = 'sparkle-container'
sparkleContainer.setAttribute('role', 'none')
document.body.appendChild(sparkleContainer)
sparkle.setAttribute('role', 'none')
sparkle.setAttribute('class', 'sparkle')
sparkle.setAttributeNS(svgNS, 'viewBox', '0 0 100 100')
sparkle.innerHTML = '<use xlink:href="#sparkle1"/><use xlink:href="#sparkle2"/>'

function glitter() {
  if (prevDocumentWidth === document.documentElement.clientWidth) {
    return
  }

  if (sparkleContainer.hasChildNodes()) {
    sparkleContainer.innerHTML = ''
  }

  prevDocumentWidth = document.documentElement.clientWidth
  var max = Math.round(document.documentElement.clientWidth / 100),
    min = Math.round(max * 0.618),
    numOfSparkles = getRandomInt(min < 3 ? 3 : min, max < 3 ? 3 : max),
    headerDimensions = Math.round(
      document.querySelector('.webgl').getBoundingClientRect().height +
        (slope < 0 ? slope * document.documentElement.clientWidth : 0)
    ),
    i,
    j,
    clone,
    use,
    delay,
    size

  for (i = 0; i < numOfSparkles; i++) {
    clone = sparkle.cloneNode(true)
    clone.style.top = ''.concat(getRandomInt(50, headerDimensions), 'px')
    clone.style.left = ''.concat(
      getRandomInt(50, document.documentElement.clientWidth),
      'px'
    )
    size = getRandomInt(1, 4) * 25

    if (size !== 50) {
      clone.style.width = ''.concat(size, 'px')
      clone.style.height = ''.concat(size, 'px')
    }

    use = clone.querySelectorAll('use')
    delay = getRandomInt(0, 1000)

    for (j = 0; j < use.length; j++) {
      use[j].style.animationDelay = ''
        .concat(delay, 'ms, ')
        .concat(delay + 1000, 'ms')
    }

    sparkleContainer.appendChild(clone)
  }
}

window.setTimeout(function () {
  glitter()
  window.addEventListener('resize', debounce(glitter, 100))
  window.addEventListener('orientationchange', glitter)
}, 100)
