export let getLines = (output): string[] => {
  return output.split('\n');
}

export let getColumn = (line): number => {
  let column,
      sections = line.split(':');

  if (sections[2]) {
    column = +/\d+/.exec(sections[2])[0];
  }

  return column;
}