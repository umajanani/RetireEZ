import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <header class="text-center" style="margin-bottom: 40px;">
        <h1 style="color: white; font-size: 3rem; margin-bottom: 10px;">💰 RetireEZ</h1>
        <p style="color: rgba(255,255,255,0.8); font-size: 1.2rem;">Smart retirement planning for Gen Z</p>
      </header>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}