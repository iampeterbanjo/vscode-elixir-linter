interface ILineInfo {
  check?: string;
  column?: number;
  position?: number;
  message?: string;
}

export const getLines = (output): string[] => {
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

export const getFileInfo = (line: string, index: number = 0): string => {
  const fileInfo: string[] = (line.split(" ")[2] || "").split(":");
  const found = fileInfo[index];

  return found || "";
};

export const getLineInfoCheck = (info: ILineInfo, line: string): ILineInfo => {
  const lintInfo = line.split(" ");
  const checkIndex = 0;
  info.check = (lintInfo[checkIndex] || [])[1];

  return info;
};

export const getLineInfoColumn = (info: ILineInfo, line: string): ILineInfo => {
  const column = getFileInfo(line, 2);
  info.column = column ? parseInt(column, 10) : undefined;

  return info;
};

export const getLineInfoMessage = (info: ILineInfo, line: string): ILineInfo => {
  const lintInfo: string[] = line.split(" ");
  const messageIndex = 3;
  info.message = lintInfo.slice(messageIndex).join(" ") || undefined;

  return info;
};

export const getLineInfoPosition = (info: ILineInfo, line: string): ILineInfo => {
  const position = getFileInfo(line, 1);
  info.position = position ? parseInt(position, 10) : undefined;

  return info;
};

export const getLineInfo = (line): ILineInfo => {
  if (!line) {
    return;
  }

  const result = [{}].map((info) => {
    return getLineInfoCheck(info, line);
  }).map((info) => {
    return getLineInfoMessage(info, line);
  }).map((info) => {
    return getLineInfoColumn(info, line);
  }).map((info) => {
    return getLineInfoPosition(info, line);
  });

  return result[0];
};

export const getDiagnosticInfo = (ILineInfo): any => {
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

export const makeZeroIndex = (value: number): number => {
  if (value <= 0) {
    return 0;
  }

  return value - 1;
};
