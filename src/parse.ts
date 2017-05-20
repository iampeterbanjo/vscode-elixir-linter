interface LineInfo {
  column?: number,
  position?: number,
  message?: string
}

export let getLines = (output): string[] => {
  if (!output) {
    return [];
  }
  return output.split('\n')
    .filter((x) => {
      if (x.length) {
        return x;
      }
    });
}

export let getLineInfo = (line): LineInfo => {
  if (!line) {
    return;
  }

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
  if (positionSection && columnSection) {
    info.message = columnSection.slice(columnSection.indexOf(' ')).trim();
  }

  return info;
}

export let getDiagnosticInfo = (lineInfo): any => {
  if (!lineInfo) {
    return;
  }

  let isNotAnumber = isNaN(parseInt(lineInfo.position)) || isNaN(parseInt(lineInfo.column)),
      isLessThanOrEqualToZero = lineInfo.position <= 0 || lineInfo.column <= 0

  if (isNotAnumber || isLessThanOrEqualToZero) {
    return;
  }

  return {
    startLine: makeZeroIndex(lineInfo.position),
    endLine: makeZeroIndex(lineInfo.position),
    startColumn: 0,
    endColumn: makeZeroIndex(lineInfo.column),
    message: lineInfo.message,
    severity: 1
  }
}

export let makeZeroIndex = (value: number): number => {
  if (value <= 0) {
    return 0;
  }

  return value - 1;
}
