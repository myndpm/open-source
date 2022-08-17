import { Observable, Subject } from 'rxjs';

export function onComplete<T>(
  observable: Observable<T>,
  next?: (value: T) => void,
  error?: (error: any) => void,
  complete?: () => void,
): Observable<void> {
  const observe = new Subject<void>();

  observable.subscribe(
    next,
    error,
    () => {
      complete?.();
      observe.next();
      observe.complete();
    },
  );

  return observe;
}
