const Environment = {}

;(function(env) {
  Environment[(Environment['RUN'] = 0)] = 'RUN'
  Environment[(Environment['TEST'] = 1)] = 'TEST'
})(Environment)

module.exports = Environment
