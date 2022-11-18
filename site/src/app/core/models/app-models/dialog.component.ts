export abstract class DialogComponent<T> {
  abstract setup(data: T): void;
}
