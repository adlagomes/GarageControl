import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { ToastComponent } from "./components/shared/toast/toast.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastComponent, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'GaragesApp';
  isDarkMode = false;
  themeColor: 'cyanGreen' | 'pink' | 'blue' | 'purple' = 'cyanGreen';
  showColorMenu = false;

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

  setThemeColor(color: 'pink' | 'blue' | 'purple' | 'cyanGreen') {
    this.themeColor = color;
    localStorage.setItem('themeColor', color);
  }
}
