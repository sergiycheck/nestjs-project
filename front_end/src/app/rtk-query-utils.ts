export type ListContainsIds = { id: string | number }[];

export function providesList<R extends ListContainsIds, T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) {
  return resultsWithIds
    ? //successful query
      [{ type: tagType, id: "LIST" }, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
    : // error occurred
      [{ type: tagType, id: "LIST" }];
}
