export type Numberish = number | null;

// can't express through typescript, but this also filters out NaN values
export function isValid(n: Numberish): n is number {
  return !(n !== 0 && !n);
}

export type Result<T = unknown, E = unknown> = OkResult<T> | ErrResult<E>;

type OkResult<T> = {
  isOk: true;
  success: T;
};

export function Ok<T>(arg: T): OkResult<T> {
  return {
    isOk: true,
    success: arg,
  };
}

export function Err<E>(error: E): ErrResult<E> {
  return {
    isOk: false,
    error: error,
  };
}

type ErrResult<E> = {
  isOk: false;
  error: E;
};
