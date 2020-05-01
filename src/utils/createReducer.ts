/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Action<TType extends string = string> {
  type: TType;
}

export type GetAction<
  TAction extends Action,
  TType extends TAction['type']
> = TAction extends Action<TType> ? TAction : never;

export type Handlers<TState, TRootAction extends Action> = {
  [P in TRootAction['type']]: (
    state: TState,
    action: GetAction<TRootAction, P>,
  ) => TState;
};

export type PartialHandlers<TState, TRootAction extends Action> = {
  [P in TRootAction['type']]: (
    state: TState,
    action: GetAction<TRootAction, P>,
  ) => Partial<TState>;
};

export type RootAction = {} extends { RootAction: infer T } ? T : any;

export function createReducer<TState, TRootAction extends Action = RootAction>(
  handlers: Handlers<TState, TRootAction>,
) {
  const rootReducer = (state: TState, action: TRootAction) => {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      const reducer = handlers[action.type as TRootAction['type']];
      if (typeof reducer !== 'function') {
        throw Error(
          `Reducer under "${action.type}" key is not a valid reducer`,
        );
      }
      return reducer(
        state,
        action as GetAction<TRootAction, TRootAction['type']>,
      );
    }
    return state;
  };

  return rootReducer;
}

export function createMergingReducer<
  TState,
  TRootAction extends Action = RootAction
>(handlers: PartialHandlers<TState, TRootAction>) {
  const rootReducer = (state: TState, action: TRootAction) => {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type) && state) {
      const reducer = handlers[action.type as TRootAction['type']];
      if (typeof reducer !== 'function') {
        throw Error(
          `Reducer under "${action.type}" key is not a valid reducer`,
        );
      }
      return {
        ...state,
        ...reducer(
          state,
          action as GetAction<TRootAction, TRootAction['type']>,
        ),
      };
    }
    return state;
  };

  return rootReducer;
}
