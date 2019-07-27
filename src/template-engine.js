const fs = require('fs')
const vm = require('vm')
const path = require('path')


/** @module TemplateEngine
 * A template rendering engine.
 */
module.exports = class TemplateEngine {
  /** @constructor
   * Constructs a new TemplateEngine instance,
   * loading the templates into a cache.
   * @param {string} templateDir - the directory
   * where the template files are found
   */
  constructor(templateDir) {
    if (typeof templateDir !== 'string' || templateDir === '')
      throw new TypeError('The templateDir argument must be a non-empty string')
    
    this.templates = {}
    
    // helper function to load templates
    const loadTemplates = (directoryPath, templatePath) => {
      var items = fs.readdirSync(path.join(directoryPath, templatePath))
      
      items.forEach((item) => {
        try {
          const templateId = path.join(templatePath, item)
          const filePath = path.join(directoryPath, templatePath, item)
        
          this.templates[templateId] = fs.readFileSync(filePath, { encoding: 'utf-8' })
        } catch (err) {
          if (err.code === 'EISDIR') {
            // we tried to read a directory, recursively load subdirectories
            loadTemplates(directoryPath, path.join(templatePath, item))
          } else {
            throw err
          }
        }
      })
    }
    
    loadTemplates(templateDir, '')
    this.render = this.render.bind(this)
  }
  
  /** @method render
   * Synchronously renders the specified cached template
   * using the supplied context object.
   * @param {string} templateId - the template identifier
   * @param {object} context [optional] - the variables to
   * supply the sandbox
   */
  render(templateId, context) {
    if (typeof templateId !== 'string' || templateId === '')
      throw new TypeError('templateId must be a non-empty string')
    if (!this.templates[templateId])
      throw new ReferenceError(`Template ${templateId} not defined`)
    
    var code = this.templates[templateId]
      .replace(/include\(['|"](\S+)["|']\)/g, (match, includedTemplate) => {
        if (!this.templates[includedTemplate])
          throw new ReferenceError(`Included template ${includedTemplate} does not exist`)
        return '`' + this.templates[includedTemplate] + '`'
      })
    
    try {
      return vm.runInNewContext('`' + code + '`', context)
    } catch (err) {
      console.error(err)
      throw new EvalError(`Error processing template ${templateId}`)
    }
  }
}