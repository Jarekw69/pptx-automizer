import JSZip from 'jszip'
import XmlHelper from './xml'
import { ICounter, RootPresTemplate } from '../types/app'

export default class CountHelper implements ICounter {
  template: RootPresTemplate
  name: string
  count: number
  
  constructor(name: string, template: RootPresTemplate) {
    this.name = name
    this.template = template
  }

  static increment(name:string, counters: ICounter[]): number | null {
    return CountHelper.getCounterByName(name, counters)._increment()
  }

  static count(name:string, counters: ICounter[]): number {
    return CountHelper.getCounterByName(name, counters).get()
  }

  static getCounterByName(name:string, counters: ICounter[]): ICounter {
    let counter = counters.find(counter => counter.name === name)
    if(counter === undefined) {
      throw new Error(`Counter ${name} not found.`)
    }
    return counter
  }

  _increment(): number {
    this.count++
    return this.count
  }

  async set() {
    let method = this.getCounterMethod()
    if(method === undefined) {
      throw new Error(`No way to count ${this.name}.`)
    }
    
    this.count = await method(await this.template.archive)
  }

  get(): number {
    return this.count
  }

  getCounterMethod(): any {
    switch (this.name) {
      case 'slides' : return CountHelper.countSlides
      case 'charts' : return CountHelper.countCharts
      case 'images' : return CountHelper.countImages
    }
  }

  static async countSlides(presentation: JSZip): Promise<number> {
    let presentationXml = await XmlHelper.getXmlFromArchive(presentation, 'ppt/presentation.xml')
    let slideCount = presentationXml.getElementsByTagName('p:sldId').length
    return slideCount
  }

  static async countCharts(presentation: JSZip): Promise<number> {
    let contentTypesXml = await XmlHelper.getXmlFromArchive(presentation, '[Content_Types].xml')
    let overrides = contentTypesXml.getElementsByTagName('Override')
    let chartCount = 0

    for(let i in overrides) {
      let override = overrides[i]
      if(override.getAttribute) {
        let contentType = override.getAttribute('ContentType')
        if(contentType === `application/vnd.openxmlformats-officedocument.drawingml.chart+xml`) {
          chartCount++
        }
      }
    }

    return chartCount
  }

  static async countImages(presentation: JSZip): Promise<number> {
    let files = presentation.file(/ppt\/media\/image/)
    return files.length
  }
}