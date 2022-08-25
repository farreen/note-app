import * as t from "io-ts";

import { decode } from "./decoder";

export const Note = t.type({
  id: t.string,
  title: t.string,
  content: t.string,
  tags: t.array(t.string),
  date: t.string,
});

export type Note = t.TypeOf<typeof Note>;

// const isString = (arg: any) => {
//   return typeof arg === "string";
// };
//
// const isArrayOfString = (arg: any) => {
//   if (!Array.isArray(arg)) {
//     return false;
//   }
//   for (const item of arg) {
//     if (!isString(item)) {
//       return false;
//     }
//   }
//   return true;
// };
//
// const isNote = (arg: any) => {
//   return (
//     isString(arg.id) &&
//     isString(arg.title) &&
//     isString(arg.content) &&
//     isString(arg.date) &&
//     isArrayOfString(arg.tags)
//   );
// };
//
// const isArrayOfNotes = (arg: any) => {
//   return Array.isArray(arg) && arg.filter(isNote).length === arg.length;
// };
//
// export function deserializeAsNotes(rawNotes: any): Note[] {
//     if(!isArrayOfNotes(rawNotes)) {
//         throw Error("rawNotes cannot be deserialized into notes");
//     }
//     return rawNotes as Note[];
// }

export function deserializeAsNotes(rawNotes: any): Note[] {
  return decode(t.array(Note), rawNotes);
}

export const isEqual = (left: Note, right: Note): boolean => {
  return (
    left.title === right.title &&
    left.content === right.content &&
    left.id === right.id
  );
};

/*
// library

class Type<T = {}> {
    readonly _T!: T;
};

class StringC extends Type<string> {

    deserialize(data: any): string {
        if(typeof data !== 'string') {
            throw Error("StringC cannot deserialize");
        }
        return data as string;
    }
};

const StringType = new StringC();

class NumberC extends Type<number> {

    deserialize(data: any): number {
        if(typeof data !== 'number') {
            throw Error("NumberC cannot deserialize");
        }
        return data as number;
    }
};

const NumberType = new NumberC();

type TypeOf<T extends Type> = T["_T"];

//////
const Content = StringType;

type Content = TypeOf<typeof Content>; 

const Age = NumberType;

type Age = TypeOf<typeof Age>;


function processContent(content: Age) {
}

const t = Content.deserialize("hello");
*/
