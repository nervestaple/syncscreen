import { GetAction, Action, RootAction } from './createReducer';

type Handlers<TState, TRootAction extends Action> = {
  [P in TRootAction['type']]: (
    action: GetAction<TRootAction, P>,
  ) => Partial<TState>;
};

export function createRoomReducer<
  TState,
  TRootAction extends Action = RootAction
>(handlers: Handlers<TState, TRootAction>) {
  const rootReducer = (action: TRootAction) => {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      const reducer = handlers[action.type as TRootAction['type']];
      if (typeof reducer !== 'function') {
        throw Error(
          `Reducer under "${action.type}" key is not a valid reducer`,
        );
      }
      return reducer(action as GetAction<TRootAction, TRootAction['type']>);
    }
  };

  return rootReducer;
}
