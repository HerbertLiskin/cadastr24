import fs from 'fs';

const aptNums = [4, 9, 10, 11, 13, 14, 16, 20, 26, 27, 36, 39, 47, 48, 49, 53, 54, 55, 56, 58, 60, 62, 65, 67, 72, 73, 74, 75, 76, 77, 78, 80];
const data = JSON.parse(fs.readFileSync('/Users/herbertliskin/Documents/JS_Projects/cadastr24/public/cadastrCurrent.json', 'utf8'));

for (const num of aptNums) {
  const apt = data.find(a => a.address && String(a.address.apartment) === String(num));
  if (apt) {
    console.log(`=== Apartment ${num} (Total Area: ${apt.area}) ===`);
    if (apt.rights && apt.rights.length > 0) {
      for (const r of apt.rights) {
        console.log(`  - FIO: ${r.fio}, Part: ${r.part || '1/1'}`);
      }
    } else {
      console.log('  No rights found');
    }
  } else {
    console.log(`=== Apartment ${num} not found ===`);
  }
}
