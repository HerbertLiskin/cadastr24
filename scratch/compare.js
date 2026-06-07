import fs from 'fs';

const protocol = [
  { apt: 4, name: "Виктор Б.", area: 13.7500 },
  { apt: 4, name: "Виктор Б.", area: 22.6471 },
  { apt: 9, name: "Юрий Б.", area: 50.2667 },
  { apt: 9, name: "Юрий Б.", area: 25.1333 },
  { apt: 10, name: "Лариса Ж.", area: 58.2000 },
  { apt: 11, name: "МИХАИЛ К.", area: 29.4000 },
  { apt: 11, name: "Ксения К.", area: 29.4000 },
  { apt: 13, name: "Ирина К.", area: 18.6000 },
  { apt: 14, name: "Екатерина В.", area: 13.3029 },
  { apt: 16, name: "Валерия М.", area: 27.9500 },
  { apt: 16, name: "АННА Б.", area: 27.9500 },
  { apt: 20, name: "Русана Т.", area: 55.6000 },
  { apt: 26, name: "АНДРЕЙ М.", area: 58.3000 },
  { apt: 27, name: "Александра П.", area: 19.0000 },
  { apt: 27, name: "Александра П.", area: 19.0000 },
  { apt: 36, name: "Юрий К.", area: 18.8500 },
  { apt: 36, name: "Юрий К.", area: 18.8500 },
  { apt: 36, name: "Юрий К.", area: 18.8500 },
  { apt: 39, name: "Екатерина Ц.", area: 37.5000 },
  { apt: 47, name: "Данил И.", area: 57.8000 },
  { apt: 48, name: "Ольга З.", area: 75.7000 },
  { apt: 49, name: "Александр Б.", area: 18.7500 },
  { apt: 53, name: "Михаил З.", area: 37.3000 },
  { apt: 53, name: "Денис Б.", area: 37.3000 },
  { apt: 54, name: "Елизавета П.", area: 9.6000 },
  { apt: 54, name: "Юлия П.", area: 19.2000 },
  { apt: 54, name: "Юлия П.", area: 9.6000 },
  { apt: 55, name: "Геннадий К.", area: 57.7000 },
  { apt: 56, name: "Сергей Ф.", area: 30.0000 },
  { apt: 56, name: "Никита Ф.", area: 15.0000 },
  { apt: 58, name: "Светлана К.", area: 38.1000 },
  { apt: 60, name: "Марина П.", area: 75.0000 },
  { apt: 62, name: "Ольга Л.", area: 28.9500 },
  { apt: 62, name: "Ольга Л.", area: 28.9500 },
  { apt: 65, name: "Арина К.", area: 27.9500 },
  { apt: 65, name: "Юлия М.", area: 27.9500 },
  { apt: 67, name: "ЕВГЕНИЯ В.", area: 29.2500 },
  { apt: 67, name: "Денис П.", area: 29.2500 },
  { apt: 72, name: "Мария А.", area: 37.6000 },
  { apt: 72, name: "Александр А.", area: 37.6000 },
  { apt: 73, name: "Александр С.", area: 56.2000 },
  { apt: 74, name: "Анастасия Ю.", area: 39.0000 },
  { apt: 74, name: "ВАРВАР А К.", area: 19.5000 },
  { apt: 75, name: "Валентина М.", area: 57.7000 },
  { apt: 76, name: "Константин Н.", area: 74.6000 },
  { apt: 77, name: "Антон В.", area: 55.7000 },
  { apt: 78, name: "Елена П.", area: 58.4000 },
  { apt: 80, name: "СЕРГЕЙ П.", area: 12.3667 },
  { apt: 80, name: "СЕРГЕЙ П.", area: 10.8208 }
];

const data = JSON.parse(fs.readFileSync('/Users/herbertliskin/Documents/JS_Projects/cadastr24/public/cadastrCurrent.json', 'utf8'));

function parseFraction(str) {
  if (!str) return 1.0;
  const parts = str.split('/');
  if (parts.length === 2) {
    return parseFloat(parts[0]) / parseFloat(parts[1]);
  }
  return 1.0;
}

function nameMatches(fio, protoName) {
  const fioWords = fio.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const protoWords = protoName.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  let hasFirst = false;
  let hasLastInitial = false;
  
  for (const pw of protoWords) {
    if (pw.endsWith('.')) {
      const initial = pw.slice(0, -1);
      if (fioWords.some(fw => fw.startsWith(initial))) {
        hasLastInitial = true;
      }
    } else if (pw.length === 1) {
      if (fioWords.some(fw => fw.startsWith(pw))) {
        hasLastInitial = true;
      }
    } else {
      if (fioWords.includes(pw)) {
        hasFirst = true;
      }
    }
  }
  
  return hasFirst && hasLastInitial;
}

const mismatches = [];

for (const entry of protocol) {
  const aptNumStr = String(entry.apt);
  const apt = data.find(a => a.address && String(a.address.apartment) === aptNumStr);
  
  if (!apt) {
    mismatches.push({
      apt: entry.apt,
      protoName: entry.name,
      protoArea: entry.area,
      dbName: 'N/A (Apartment not found)',
      dbArea: 'N/A',
      reason: 'Apartment not found in database'
    });
    continue;
  }
  
  const totalArea = parseFloat(apt.area || '0');
  
  let matchedRight = null;
  if (apt.rights && apt.rights.length > 0) {
    for (const right of apt.rights) {
      if (nameMatches(right.fio || '', entry.name)) {
        matchedRight = right;
        break;
      }
    }
  }
  
  if (!matchedRight) {
    const ownersList = apt.rights ? apt.rights.map(r => `${r.fio} (${r.part || '1/1'})`).join(', ') : 'None';
    mismatches.push({
      apt: entry.apt,
      protoName: entry.name,
      protoArea: entry.area,
      dbName: 'N/A',
      dbArea: 'N/A',
      reason: `Owner not found in database. DB Owners: [${ownersList}]`
    });
    continue;
  }
  
  const share = parseFraction(matchedRight.part);
  const calculatedArea = totalArea * share;
  const diff = Math.abs(calculatedArea - entry.area);
  
  if (diff > 0.01) {
    mismatches.push({
      apt: entry.apt,
      protoName: entry.name,
      protoArea: entry.area.toFixed(4),
      dbName: matchedRight.fio,
      dbShare: matchedRight.part || '1/1',
      dbArea: calculatedArea.toFixed(4),
      reason: `Area mismatch. Protocol: ${entry.area.toFixed(4)}, DB calculated: ${calculatedArea.toFixed(4)} (Total apt area: ${totalArea}, share: ${matchedRight.part || '1/1'})`
    });
  }
}

console.log(JSON.stringify(mismatches, null, 2));
console.log("Total mismatches:", mismatches.length);
