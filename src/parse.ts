interface ILineInfo {
  column?: number;
  position?: number;
  message?: string;
}

export let getLines = (output): string[] => {
  if (!output) {
    return [];
  }
  return output.split("\n")
    .filter((x) => {
      if (x.length) {
        return x;
      }
    });
};

export let getLineInfo = (line): ILineInfo => {
  if (!line) {
    return;
  }

  const info: any = {};
  const sections: string[] = line.split(":");
  const positionSection = sections[1];
  const columnSection = sections[2];

  if (positionSection) {
    info.position = +/\d+/.exec(positionSection)[0];
  }

  if (columnSection) {
    info.column = +/\d+/.exec(columnSection)[0];
  }
  if (positionSection && columnSection) {
    info.message = columnSection.slice(columnSection.indexOf(" ")).trim();
  }

  return info;
};

export let getDiagnosticInfo = (ILineInfo): any => {
  if (!ILineInfo) {
    return;
  }

  const isNotAnumber = isNaN(parseInt(ILineInfo.position, 10)) || isNaN(parseInt(ILineInfo.column, 10));
  const isLessThanOrEqualToZero = ILineInfo.position <= 0 || ILineInfo.column <= 0;

  if (isNotAnumber || isLessThanOrEqualToZero) {
    return;
  }

  return {
    endColumn: makeZeroIndex(ILineInfo.column),
    endLine: makeZeroIndex(ILineInfo.position),
    message: ILineInfo.message,
    severity: 1,
    startColumn: 0,
    startLine: makeZeroIndex(ILineInfo.position),
  };
};

export let makeZeroIndex = (value: number): number => {
  if (value <= 0) {
    return 0;
  }

  return value - 1;
};
