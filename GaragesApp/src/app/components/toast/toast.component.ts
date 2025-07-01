import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  currentMessage: ToastMessage | null = null;
  private messageSubscription!: Subscription;
  private timeoutId: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.messageSubscription = this.notificationService.messages$.subscribe(message => {
      if (message) {
        this.currentMessage = message;
        if (message)
          this.currentMessage = message;
        // Limpa o timeout anterior, se houver
        if (this.timeoutId)
          clearTimeout(this.timeoutId);
      // Configura o timeout para remover a mensagem após a duração especificada
      this.timeoutId = setTimeout(() => {
        this.currentMessage = null;
      }, message?.duration || 3000); // Duração padrão de 3000ms
    }
  });
}

  ngOnDestroy(): void {
    if (this.messageSubscription)
      this.messageSubscription.unsubscribe();
    if (this.timeoutId)
      clearTimeout(this.timeoutId);
  }

  // Permite que o usuário feche a mensagem manualmente
  closeToast(): void {
    this.currentMessage = null;
    if (this.timeoutId)
      clearTimeout(this.timeoutId);
  }
}
