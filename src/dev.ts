import Automizer, { ChartData, modify, TableRow, TableRowStyle } from './index';
import { vd } from './helper/general-helper';

const automizer = new Automizer({
  templateDir: `${__dirname}/../__tests__/pptx-templates`,
  outputDir: `${__dirname}/../__tests__/pptx-output`,
  removeExistingSlides: true,
});

const run = async () => {
  const pres = automizer
    .loadRoot(`RootTemplate.pptx`)
    .load(`SlideWithCharts.pptx`, 'charts')
    .load(`SlideWithImages.pptx`, 'images');

  const result = await pres
    .addSlide('charts', 2, (slide) => {
      slide.removeElement('ColumnChart');
    })
    .addSlide('images', 2, (slide) => {
      slide.removeElement('imageJPG');
      slide.removeElement('Textfeld 5');
      slide.addElement('images', 2, 'imageJPG');
    })
    .write(`remove-element.test.pptx`);
};

run().catch((error) => {
  console.error(error);
});
