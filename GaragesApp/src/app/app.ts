import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastComponent } from "./components/toast/toast.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'GaragesApp';
  isDarkMode = false;

  ngOnInit(): void {
    // Aplica o tema escuro se o usuário ativou anteriormente
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    // const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
}
