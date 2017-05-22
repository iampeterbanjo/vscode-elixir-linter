interface ILineInfo {
  check?: string;
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
  const fileInfo: string[] = line.split(":");
  const lintInfo: string[] = line.split(" ");
  const positionInfo = fileInfo[1];
  const columnInfo = fileInfo[2];

  const checkIndex = 0;
  const fileIndex = 2;
  const messageIndex = 3;

  if (positionInfo) {
    info.position = +/\d+/.exec(positionInfo)[0] || undefined;
  }

  if (columnInfo) {
    info.column = +/\d+/.exec(columnInfo)[0] || undefined;
  }

  info.message = lintInfo.slice(messageIndex).join(" ") || undefined;
  info.check = (lintInfo[checkIndex] || [])[1];

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
