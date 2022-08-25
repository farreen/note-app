import * as t from "io-ts";
import * as Either from "fp-ts/Either";

export function decode<A, O, I>(codec: t.Type<A, O, I>, input: I): A {
  const result = codec.decode(input);
  const contextPath = (ctx: t.Context) => {
    return `${ctx
      .filter(({ key }) => Boolean(key))
      .map(({ key }) => key)
      .join(".")}`;
  };
  const toString = (e: t.ValidationError) => {
    const errorCodec = e.context[e.context.length - 1];
    return `Error decoding ${contextPath(e.context)} : ${
      e.message ??
      `unexpected ${JSON.stringify(e.value)}${
        errorCodec ? `, expecting ${errorCodec.type.name}` : ""
      }`
    }`;
  };
  return Either.getOrElse<t.Errors, A>((errs) => {
    const msg = errs.map(toString).join("\n");
    throw new Error(msg);
  })(result);
}
