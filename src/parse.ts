interface LineInfo {
  column?: number,
  position?: number
}

export let getLines = (output): string[] => {
  return output.split('\n');
}

export let getLineInfo = (line): LineInfo => {
  let info: any = {},
      sections: string[] = line.split(':'),
      positionSection = sections[1],
      columnSection = sections[2];

  if (positionSection) {
    info.position = +/\d+/.exec(positionSection)[0];
  }

  if (columnSection) {
    info.column = +/\d+/.exec(columnSection)[0];
  }

  return info;
}