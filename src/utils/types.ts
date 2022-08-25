
export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
};

const isString = (arg: any) => {
  return typeof arg === "string";
};

const isArrayOfString = (arg: any) => {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (const item of arg) {
    if (!isString(item)) {
      return false;
    }
  }
  return true;
};

const isNote = (arg: any) => {
  return (
    isString(arg.id) &&
    isString(arg.title) &&
    isString(arg.content) &&
    isString(arg.date) &&
    isArrayOfString(arg.tags)
  );
};

const isArrayOfNotes = (arg: any) => {
  return Array.isArray(arg) && arg.filter(isNote).length === arg.length;
};

export const isEqual = (left: Note, right: Note): boolean => {
  return (
    left.title === right.title &&
    left.content === right.content &&
    left.id === right.id
  );
};

export function deserializeAsNotes(rawNotes: any): Note[] {
    if(!isArrayOfNotes(rawNotes)) {
        throw Error("rawNotes cannot be deserialized into notes");
    }
    return rawNotes as Note[];
}

