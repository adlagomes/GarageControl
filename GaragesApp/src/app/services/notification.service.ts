import { Injectable } from "@angular/core";
import { BehaviorSubject, filter } from "rxjs";


export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // Duração em milissegundos, padrão é 3000
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _messages = new BehaviorSubject<ToastMessage | null>(null);
  readonly messages$ = this._messages.asObservable().pipe(
    filter(message => message !== null) // Emite apenas quando há uma mensagem válida
  );

  constructor() {}

  show(
    message: string,
    type: ToastMessage['type'] = 'info',
    duration: number = 3000
  ): void {
    this._messages.next({ message, type, duration });
  }

  success(
    message: string,
    duration?: number
  ): void {
    this.show(message, 'success', duration);
  }

  error(
    message: string,
    duration?: number
  ): void {
    this.show(message, 'error', duration);
  }

  info(
    message: string,
    duration?: number
  ): void {
    this.show(message, 'info', duration);
  }

  warning(
    message: string,
    duration?: number
  ): void {
    this.show(message, 'warning', duration);
  }

}