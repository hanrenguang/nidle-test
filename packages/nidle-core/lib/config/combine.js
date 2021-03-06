import extend from 'extend'

/**
 * 将用户input结合到stages插件配置中
 * @param {Array} stages
 * @param {Array} inputs
 * @returns stages
 */
export default function combine(stages, inputs) {
  stages.forEach(stage => {
    const { name: stageName } = stage
    stage.steps.forEach(step => {
      const { name: stepName } = step
      const currentInput = inputs.find(input => {
        return input.stage === stageName && input.step === stepName
      })

      if (currentInput) {
        step.options = extend(true, {}, step.options || {}, currentInput.options)
      } else {
        step.options = extend(true, {}, step.options || {})
      }
    })
  })

  return stages
}
