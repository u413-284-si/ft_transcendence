export function hasDuplicates(nicknames: string[]): boolean {
  return new Set(nicknames).size !== nicknames.length;
}
